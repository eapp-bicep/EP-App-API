import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SaveUserProfileDto } from './dto/save-user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonMessageResponse } from 'src/types';
import { PrismaService } from 'src/prisma';
import { CloudinaryService } from 'src/cloudinary';
import { DocumentType, OnboardingStepOnRole, Roles } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async saveUserProfile(
    userId: string,
    saveUserProfileDto: SaveUserProfileDto,
    profileImage: Express.Multer.File,
  ): Promise<CommonMessageResponse> {
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
      `${userId}/profile`,
    );

    const onboardingStep = await this.getOnboardingStep(
      'PersonalInformation',
      Roles.ENTREPRENEUR,
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

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: { connect: onboardingStep },
      },
    });
    return { message: 'We have saved your personal data, thank you.' };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getOnboardingStep(
    stepName: string,
    role: Roles,
  ): Promise<OnboardingStepOnRole> {
    return await this.prisma.onboardingStepOnRole.findFirstOrThrow({
      where: { stepName, role: { role } },
    });
  }
}
