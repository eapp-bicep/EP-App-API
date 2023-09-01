import {
  Body,
  Controller,
  Post,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('onboarding')
export class OnboardingController {
  constructor(
    private onboardingService: OnboardingService,
    private userService: UserService,
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
    @Body() saveBusinessInfoDto: SaveBusinessInfoDto,
  ) {
    return this.userService.saveBusinessInformation(
      userId,
      saveBusinessInfoDto,
    );
  }
}
