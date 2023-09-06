import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  FinishOnboardingDto,
  VerifyEmailCodeDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  VerifyPhoneOTPDto,
} from './dto';
import { GetCurrentUser } from 'src/shared/decorators';
import {
  SaveBusinessInfoDto,
  SaveProfessionalInfoDto,
  SaveUserProfileDto,
  UserService,
} from 'src/features/user';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateIdeaDto, IdeasService } from 'src/features/ideas';
import { Roles, User } from '@prisma/client';
@Controller('onboarding')
export class OnboardingController {
  constructor(
    private onboardingService: OnboardingService,
    private userService: UserService,
    private ideaService: IdeasService,
  ) {}

  @Get()
  getCurrentOnboardingStep(@GetCurrentUser('id') userId: string) {
    return this.onboardingService.getCurrentOnboardingStep(userId);
  }

  @Post('/verify-email')
  sendEmailVerificationCode(
    @GetCurrentUser('id') userId: string,
    @Body() verifyEmailDto: VerifyEmailDto,
  ) {
    return this.onboardingService.sendEmailVerificationCode(
      userId,
      verifyEmailDto,
    );
  }

  @Post('/verify-email-code')
  verifyEmailCode(
    @GetCurrentUser('id') userId: string,
    @Body() verifyEmailCodeDto: VerifyEmailCodeDto,
  ) {
    return this.onboardingService.verifyEmailCode(userId, verifyEmailCodeDto);
  }

  @Post('/verify-phone')
  sendPhoneOTP(
    @GetCurrentUser('id') userId: string,
    @Body() verifyPhoneDto: VerifyPhoneDto,
  ) {
    return this.onboardingService.sendPhoneOTP(userId, verifyPhoneDto);
  }

  @Post('/verify-phone-otp')
  verifyPhoneOTP(
    @GetCurrentUser('id') userId: string,
    @Body() verifyPhoneOTPDto: VerifyPhoneOTPDto,
  ) {
    return this.onboardingService.verifyPhoneOTP(userId, verifyPhoneOTPDto);
  }

  @Post('/save-profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  saveUserProfile(
    @GetCurrentUser('id') userId: string,
    @Body() saveUserProfileDto: SaveUserProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.saveUserProfile(userId, saveUserProfileDto, file);
  }

  @Post('/save-business-info')
  saveBusinessInfo(
    @GetCurrentUser('id') userId: string,
    @Body('isBusinessEstablished', ParseBoolPipe)
    isBusinessEstablished: boolean,
    @Body('businessInfo') saveBusinessInfoDto: SaveBusinessInfoDto,
  ) {
    if (!isBusinessEstablished) {
      throw new BadRequestException(
        'Business is not established, so it cannot be saved.',
      );
    }
    return this.userService.saveBusinessInformation(
      userId,
      saveBusinessInfoDto,
    );
  }

  @Post('/upload-idea')
  @UseInterceptors(FilesInterceptor('pitchFiles'))
  async saveIdea(
    @GetCurrentUser('id') userId: string,
    @Body() saveIdeaDto: CreateIdeaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.ideaService.create(userId, saveIdeaDto, files);
    const { onboardingStep } = await this.userService.updateUserOnboardingStep(
      userId,
      'Finished',
      Roles.ENTREPRENEUR,
    );
    return { message: 'Uploaded idea successfully', data: onboardingStep };
  }

  //Mentor
  @Post('/save-professional-info')
  @UseInterceptors(FileInterceptor('resume'))
  async saveMentorProfessionalInfo(
    @GetCurrentUser('id') userId: string,
    @Body() saveProfessionalInfoDto: SaveProfessionalInfoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.saveProfessionalInformation(
      userId,
      saveProfessionalInfoDto,
      file,
    );
  }

  @Post('/finish')
  async finishOnboarding(
    @GetCurrentUser() user: User,
    finishDto: FinishOnboardingDto,
  ) {
    return this.onboardingService.finishOnboarding(user, finishDto);
  }
}
