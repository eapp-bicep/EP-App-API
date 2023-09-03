import {
  BadRequestException,
  Body,
  Controller,
  ParseBoolPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  VerifyEmailCodeDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  VerifyPhoneOTPDto,
} from './dto';
import { GetCurrentUser } from 'src/shared/decorators';
import {
  SaveBusinessInfoDto,
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
    await this.userService.updateUserOnboardingStep(
      userId,
      'IdeaInformation',
      Roles.ENTREPRENEUR,
    );
    return { message: 'Uploaded idea successfully' };
  }

  @Post('/finish')
  async finishOnboarding(@GetCurrentUser() user: User) {
    return this.onboardingService.finishOnboarding(user);
  }
}
