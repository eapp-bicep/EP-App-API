import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma';
import { CreateRatingDto } from './dto';
import {
  CommonMessageResponse,
  MentorRating,
  ResponseWithData,
} from 'src/types';
import { RatingType, Roles } from '@prisma/client';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}
  //TODO: Update ratings to be implemented
  async createMentorRating(
    userId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<CommonMessageResponse> {
    if (createRatingDto.ratingType === RatingType.MENTOR) {
      const mentor = await this.prisma.user.findUnique({
        where: { id: createRatingDto.rateFor, role: { role: Roles.MENTOR } },
      });
      if (!mentor)
        throw new NotFoundException('Mentor is not registered with us.');

      const exists = await this.prisma.userOnRatings.findFirst({
        where: {
          userId: createRatingDto.rateFor,
          rating: {
            ratedByUser: { id: userId },
          },
        },
      });
      if (exists)
        throw new ForbiddenException('You have already rating this mentor.');

      await this.prisma.userOnRatings.create({
        data: {
          rating: {
            create: {
              rating: createRatingDto.rating,
              ratedByUser: {
                connect: {
                  id: userId,
                },
              },
              type: createRatingDto.ratingType,
            },
          },
          user: {
            connect: {
              id: mentor.id,
            },
          },
        },
      });
      return { message: 'Thank you for rating the mentor.' };
    }
    return {
      message: 'Did not do anything, more functionalities coming in future.',
    };
  }

  async getAllMentorAverage(): Promise<ResponseWithData<MentorRating[]>> {
    // const mentor = await this.userService.getUserData(mentorId);
    const ratings: any = await this.prisma
      .$queryRaw`SELECT \"userId\", round(avg(\"rating\"), 2) as rating FROM \"UserOnRatings\" JOIN \"ratings\" ON \"UserOnRatings\".\"ratingId\" = \"ratings\".\"id\" GROUP BY \"userId\"`;

    if (ratings.length <= 0) {
      throw new NotFoundException('No ratings found.');
    }

    return {
      message: 'Fetched the average',
      data: ratings,
    };
  }

  async getMentorAverage(
    mentorId: string,
  ): Promise<ResponseWithData<MentorRating>> {
    // const mentor = await this.userService.getUserData(mentorId);
    const ratings: any = await this.prisma
      .$queryRaw`SELECT \"userId\", round(avg(\"rating\"), 2) as rating FROM \"UserOnRatings\" JOIN \"ratings\" ON \"UserOnRatings\".\"ratingId\" = \"ratings\".\"id\" WHERE \"userId\"=${mentorId} GROUP BY \"userId\" LIMIT 1`;

    if (ratings.length <= 0) {
      throw new NotFoundException('No ratings found for this mentor');
    }

    return {
      message: 'Fetched the average',
      data: {
        userId: ratings[0].userId,
        rating: Number.parseFloat(ratings[0].rating),
      },
    };
  }
}
