import { Body, Controller, Get, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  VerifyEmailCodeDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  VerifyPhoneOTPDto,
} from './dto';
import { GetCurrentUser } from 'src/shared/decorators';

@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

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
}
