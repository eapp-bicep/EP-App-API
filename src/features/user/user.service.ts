import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SaveUserProfileDto } from './dto/save-user-profile.dto';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { PrismaService } from 'src/global/prisma';
import { CloudinaryService } from 'src/dynamic-modules/cloudinary';
import { DocumentType, OnboardingStepOnRole, Roles } from '@prisma/client';
import { SaveBusinessInfoDto, SaveProfessionalInfoDto } from './dto';
import { IdeasService } from '../ideas';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private ideaService: IdeasService,
  ) {}

  async getUserData(userId: string) {
    const p = await this.prisma.extended.personalInfo.findUnique({
      where: { userId },
    });
    console.log({ p });
    return this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
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

  // async deleteUser(userId: string): Promise<CommonMessageResponse> {
  //   //Delete Ideas linked to user
  //   //
  // }

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
