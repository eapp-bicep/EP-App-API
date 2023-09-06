import { CACHE_MANAGER, CacheTTL } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/global/prisma';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import {
  FinishOnboardingDto,
  VerifyEmailCodeDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  VerifyPhoneOTPDto,
} from './dto';
import { calcDateDiff } from 'src/shared/utils';
import { MyTwilioService } from 'src/global/my-twilio';
import { OnboardingStepOnRole, User } from '@prisma/client';
import { UserService } from 'src/features/user';

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private redis: Cache,
    private config: ConfigService,
    private myTwilio: MyTwilioService,
    private userService: UserService,
  ) {}

  async sendEmailVerificationCode(
    userId: string,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<CommonMessageResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, updatedAt: true, isEmailVerified: true },
    });
    const diff = calcDateDiff(new Date(), user!.updatedAt);
    if (user?.isEmailVerified && diff.days <= 1)
      throw new ForbiddenException(
        `Please try again after ${1440 - diff.minutes} minutes.`,
      );
    //TODO: EMAIL is not working due to twilio
    // const response = await this.myTwilio.sendCodeToEmail(verifyEmailDto.email);
    // await this.redis.set(`email_${verifyEmailDto.email}`, response);
    // console.log({ response });

    return {
      message: `Your verification code has been sent to your email.`,
    };
  }

  @CacheTTL(1000 * 60 * 10) //10 min - due to twilio timeout
  async verifyEmailCode(
    userId: string,
    verifyEmailCodeDto: VerifyEmailCodeDto,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    //TODO: EMAIL is not working due to twilio
    // const emailRes = (await this.redis.get(
    //   `email_${verifyEmailCodeDto.email}`,
    // )) as any;
    // if (!emailRes)
    //   throw new ForbiddenException(
    //     'Email verification code expired or check your email.',
    //   );
    // const response = await this.myTwilio.verifyEmailCode(
    //   emailRes.sid,
    //   verifyEmailCodeDto.code,
    // );

    // if (response.status !== 'approved')
    //   throw new ForbiddenException(
    //     'Verification code not valid or check your phone number.',
    //   );
    const nextOnboardingStep = await this.userService.getOnboardingStep(
      'PhoneVerification',
      verifyEmailCodeDto.role,
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: verifyEmailCodeDto.email,
        isEmailVerified: true,
        onboardingStep: { connect: nextOnboardingStep },
      },
    });
    // await this.redis.del(`email_${verifyEmailCodeDto.email}`);
    return {
      message: 'Your email has been verified successfully',
      data: nextOnboardingStep,
    };
  }

  @CacheTTL(1000 * 60 * 10)
  async sendPhoneOTP(
    userId: string,
    verifyPhoneDto: VerifyPhoneDto,
  ): Promise<CommonMessageResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, updatedAt: true, isPhoneVerified: true },
    });
    const diff = calcDateDiff(new Date(), user!.updatedAt);
    if (user?.isPhoneVerified && diff.days <= 1)
      throw new ForbiddenException(
        `Please try again after ${1440 - diff.minutes} minutes.`,
      );
    //TODO: PHONE is not working due to twilio
    // const response = await this.myTwilio.sendOtpToPhone(verifyPhoneDto.phone);
    // await this.redis.set(`phone_${verifyPhoneDto.phone}`, response);
    return {
      message: `Your OTP has been sent to your phone number.`,
    };
  }

  async verifyPhoneOTP(
    userId: string,
    verifyOtpDTO: VerifyPhoneOTPDto,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    //TODO: EMAIL is not working due to twilio
    // const phoneRes = (await this.redis.get(
    //   `phone_${verifyOtpDTO.phone}`,
    // )) as any;

    // if (!phoneRes) throw new ForbiddenException('OTP Expired, resend otp.');
    // const response = await this.myTwilio.verifyPhoneOtp(
    //   phoneRes.sid,
    //   verifyOtpDTO.otp,
    // );

    // if (response.status !== 'approved')
    //   throw new ForbiddenException(
    //     'Verification code not valid or check your phone number.',
    //   );

    const nextOnboardingStep = await this.userService.getOnboardingStep(
      'PersonalInformation',
      verifyOtpDTO.role,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phone: verifyOtpDTO.phone,
        isPhoneVerified: true,
        onboardingStep: { connect: nextOnboardingStep },
      },
    });
    // await this.redis.del(`phone_${verifyOtpDTO.phone}`);
    return {
      message: 'Your phone has been verified successfully',
      data: nextOnboardingStep,
    };
  }

  async finishOnboarding(
    user: User,
    finishDto: FinishOnboardingDto,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    const profile = await this.prisma.personalInfo.findUnique({
      where: { userId: user.id },
    });
    if (user.isEmailVerified && user.isPhoneVerified && !profile)
      throw new NotAcceptableException(
        'Please complete email and phone verification and also upload your profile.',
      );
    const u = await this.userService.updateUserOnboardingStep(
      user.id,
      'Finished',
      finishDto.role,
    );
    return {
      message: 'Thank you for your patience. Please proceed.',
      data: u.onboardingStep,
    };
  }

  async getCurrentOnboardingStep(
    userId: string,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    const { onboardingStep } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { onboardingStep: { include: { role: true } } },
    });
    return {
      message: `You have completed ${onboardingStep.stepName}.`,
      data: onboardingStep,
    };
  }
}
