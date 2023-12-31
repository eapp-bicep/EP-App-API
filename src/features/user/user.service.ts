import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SaveUserProfileDto } from './dto/save-user-profile.dto';
import {
  CommonMessageResponse,
  DashboardResponse,
  MentorRating,
  ResponseWithData,
} from 'src/types';
import { PrismaService } from 'src/global/prisma';
import { CloudinaryService } from 'src/dynamic-modules/cloudinary';
import {
  DocumentType,
  OnboardingStepOnRole,
  PersonalInfo,
  Roles,
  User,
} from '@prisma/client';
import { SaveBusinessInfoDto, SaveProfessionalInfoDto } from './dto';
import { IdeasService } from '../ideas';
import { RatingService } from '../rating';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private ideaService: IdeasService,
    private ratingService: RatingService,
  ) {}

  async getUserData(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { onboardingStep: { include: { role: true } } },
    });
  }

  async getUserPersonalProfile(
    userId: string,
  ): Promise<ResponseWithData<PersonalInfo>> {
    const profile = await this.prisma.personalInfo.findUniqueOrThrow({
      where: { userId },
      include: { profileImage: true, occupation: true, address: true },
    });
    return { message: 'Successfully fetched user profile.', data: profile };
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.extended.user.findUniqueOrThrow({
      where: { id: userId },
      include: { role: { select: { role: true } } },
    });

    //Because this contains an image, and this will invoked the extended functionality
    if (user.role.role === Roles.ENTREPRENEUR) {
      const userIdeas = await this.prisma.userOnIdeas.findMany({
        where: { user },
      });
      await Promise.all(
        userIdeas.map((e) => this.ideaService.remove(e.ideaId)),
      );
      await this.prisma.extended.personalInfo.delete({
        where: { userId },
      });
    } else
      await this.prisma.extended.professionalInformation.delete({
        where: { userId },
      });
    return this.prisma.extended.user.delete({ where: { id: userId } });
  }

  async saveUserProfile(
    userId: string,
    saveUserProfileDto: SaveUserProfileDto,
    profileImage: Express.Multer.File,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    if (!profileImage)
      throw new BadRequestException('Profile image is not included.');

    const pInfo = await this.prisma.personalInfo.findUnique({
      where: { userId },
      select: {
        profileImage: true,
      },
    });
    if (pInfo) throw new ForbiddenException('Profile already exists.');

    const image = await this.cloudinary.uploadFile(
      profileImage,
      `preneur/${userId}/profile`,
    );

    await this.prisma.personalInfo.create({
      data: {
        firstName: saveUserProfileDto.firstName,
        lastName: saveUserProfileDto.lastName,
        user: { connect: { id: userId } },
        occupation: { connect: { id: saveUserProfileDto.occupation } },
        address: {
          create: {
            addressLine1: saveUserProfileDto.addressLine1,
            addressLine2: saveUserProfileDto.addressLine2,
            city: saveUserProfileDto.city,
            country: saveUserProfileDto.country,
            pinCode: saveUserProfileDto.pinCode,
            state: saveUserProfileDto.state,
          },
        },
        profileImage: {
          create: {
            bucket: image.folder,
            imgDownloadUrl: image.secure_url,
            imgFullPath: image.public_id,
            imgName: image.asset_id,
            imgOriginalName: image.original_filename,
            imgType: DocumentType.PROFILE_PICTURE,
          },
        },
      },
    });

    if (saveUserProfileDto.role === Roles.ENTREPRENEUR) {
      const { onboardingStep } = await this.updateUserOnboardingStep(
        userId,
        'BusinessDetails',
        saveUserProfileDto.role,
      );
      return {
        message: 'We have saved your personal data, thank you.',
        data: onboardingStep,
      };
    } else if (saveUserProfileDto.role === Roles.MENTOR) {
      const { onboardingStep } = await this.updateUserOnboardingStep(
        userId,
        'ProfessionalInformation',
        saveUserProfileDto.role,
      );
      return {
        message: 'We have saved your professional data, thank you.',
        data: onboardingStep,
      };
    }
    throw new BadRequestException('Role not provided');
  }

  async saveBusinessInformation(
    userId: string,
    saveBusinessInfoDto: SaveBusinessInfoDto,
  ): Promise<ResponseWithData<{ onboardingStep: OnboardingStepOnRole }>> {
    const exists = await this.prisma.businessInfo.findUnique({
      where: { userId },
    });
    if (exists)
      throw new ForbiddenException(
        'Business Information has been saved already.',
      );
    await this.prisma.businessInfo.create({
      data: {
        user: { connect: { id: userId } },
        ...saveBusinessInfoDto,
        domainOfWork: {
          connect: {
            id: saveBusinessInfoDto.domainOfWork,
          },
        },
      },
    });
    const { onboardingStep } = await this.updateUserOnboardingStep(
      userId,
      'IdeaInformation',
      Roles.ENTREPRENEUR,
    );
    return {
      message: 'Saved business information.',
      data: { onboardingStep },
    };
  }

  async saveProfessionalInformation(
    userId: string,
    saveProfessionalInfoDto: SaveProfessionalInfoDto,
    resume: Express.Multer.File,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    const exists = await this.prisma.professionalInformation.findUnique({
      where: { userId },
    });
    if (exists)
      throw new ForbiddenException(
        'Professional Information has been saved already.',
      );
    const image = await this.cloudinary.uploadFile(
      resume,
      `mentor/${userId}/resume`,
    );
    await this.prisma.professionalInformation.create({
      data: {
        user: { connect: { id: userId } },
        ...saveProfessionalInfoDto,
        resume: {
          create: {
            bucket: image.folder,
            imgDownloadUrl: image.secure_url,
            imgFullPath: image.public_id,
            imgName: image.asset_id,
            imgOriginalName: image.original_filename,
            imgType: DocumentType.MENTOR_RESUME,
          },
        },
        segment: {
          connect: {
            id: saveProfessionalInfoDto.segment,
          },
        },
        fieldsOfInterest: {
          connect: [
            ...saveProfessionalInfoDto.fieldsOfInterest.map((fieldId) => ({
              id: fieldId,
            })),
          ],
        },
      },
    });
    //TODO: Add subscription step
    const { onboardingStep } = await this.updateUserOnboardingStep(
      userId,
      'Finished',
      Roles.MENTOR,
    );
    return {
      message: 'Saved professional information.',
      data: onboardingStep,
    };
  }

  async getMentorsList(
    idList?: string[],
  ): Promise<ResponseWithData<Partial<User>[]>> {
    const mentors = await this.prisma.user.findMany({
      where: {
        role: { role: Roles.MENTOR },
        id: {
          in: idList,
        },
      },
      select: {
        id: true,
        email: true,
        phone: true,
        PersonalInfo: {
          select: {
            firstName: true,
            lastName: true,
            occupation: {
              select: {
                id: true,
                occupationName: true,
              },
            },
            profileImage: {
              select: {
                imgDownloadUrl: true,
              },
            },
          },
        },
        ProfessionalInformation: {
          select: {
            segment: true,
            resume: true,
          },
        },
      },
    });

    const ratings = await this.ratingService.getAllMentorAverage();
    const transformedData = mentors.map((e) => ({
      ...e,
      PersonalInfo: { ...e.PersonalInfo[0] },
      ProfessionalInformation: { ...e.ProfessionalInformation[0] },
      rating:
        Number.parseFloat(
          ratings.data?.find((r) => r.userId === e.id)?.rating?.toString() ??
            '0',
        ) ?? 0,
    }));
    return {
      message: `We have found ${mentors.length} mentors.`,
      data: transformedData,
    };
  }

  async getDashboardInfo(
    user: User,
  ): Promise<ResponseWithData<DashboardResponse>> {
    const meetings = await this.prisma.meeting.count({
      where: { scheduledByUserId: user.id, requestStatus: 'FINISHED' },
    });
    const ideas = await this.prisma.userOnIdeas.count({ where: { user } });
    const top = await this.getTopMentors();
    const topMentors = await this.getMentorsList(
      top.data?.map((e) => e.userId),
    );

    //TODO: Reduce mentors data, resume field etc not required.
    return {
      message: 'Welcome to E Park App.',
      data: {
        ideas,
        meetings,
        mentors: topMentors.data ?? [],
      },
    };
  }

  async getTopMentors(): Promise<ResponseWithData<MentorRating[]>> {
    const mentors: any = await this.prisma.$queryRaw`
    WITH Q AS (
    SELECT \"userId\", round(avg(rating), 2) AS \"average\" FROM \"UserOnRatings\"
      JOIN \"ratings\"
        ON \"UserOnRatings\".\"ratingId\" = \"ratings\".id
      WHERE \"ratings\".\"updatedAt\" < (now() - '7 day'::interval)
    GROUP BY \"userId\"
        LIMIT 5
      )
      SELECT * FROM Q WHERE average > 3.5;
    `;
    return {
      message: 'Took top 5 mentors.',
      data: mentors,
    };
  }

  async updateUserOnboardingStep(
    userId: string,
    stepName: string,
    role: Roles,
  ) {
    const onboardingStep = await this.getOnboardingStep(stepName, role);
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: { connect: onboardingStep },
      },
      include: {
        onboardingStep: {
          include: { role: true },
        },
      },
    });
  }

  async getOnboardingStep(
    stepName: string,
    role: Roles,
  ): Promise<OnboardingStepOnRole> {
    return await this.prisma.onboardingStepOnRole.findFirstOrThrow({
      where: { stepName, role: { role } },
      include: { role: true },
    });
  }
}
