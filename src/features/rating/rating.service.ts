import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma';
import { CreateRatingDto } from './dto';
import { CommonMessageResponse } from 'src/types';
import { RatingType, Roles } from '@prisma/client';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async createRating(
    userId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<CommonMessageResponse> {
    if (createRatingDto.ratingType === RatingType.MENTOR) {
      const mentor = await this.prisma.user.findUnique({
        where: { id: createRatingDto.rateFor, role: { role: Roles.MENTOR } },
      });
      if (!mentor)
        throw new NotFoundException('Mentor is not registered with us.');
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
}
