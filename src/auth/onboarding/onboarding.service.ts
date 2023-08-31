import { CACHE_MANAGER, CacheTTL } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma';
import { CommonMessageResponse } from 'src/types';
import {
  VerifyEmailCodeDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  VerifyPhoneOTPDto,
} from './dto';
import { calcDateDiff } from 'src/shared/utils';
import { MyTwilioService } from 'src/my-twilio';

@Injectable()
export class OnboardingService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private redis: Cache,
    private config: ConfigService,
    private myTwilio: MyTwilioService,
  ) {}

  async sendEmailVerificationCode(
    userId: string,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, updatedAt: true, isEmailVerified: true },
    });
    const diff = calcDateDiff(new Date(), user!.updatedAt);
    if (user?.isEmailVerified && diff.days <= 1)
      throw new ForbiddenException(
        `Please try again after ${1440 - diff.minutes} minutes.`,
      );
    const response = await this.myTwilio.sendCodeToEmail(verifyEmailDto.email);
    await this.redis.set(`email_${verifyEmailDto.email}`, response);
    return response;
  }

  @CacheTTL(1000 * 60 * 10) //10 min - due to twilio timeout
  async verifyEmailCode(
    userId: string,
    verifyEmailCodeDto: VerifyEmailCodeDto,
  ): Promise<CommonMessageResponse> {
    const emailRes = (await this.redis.get(
      `email_${verifyEmailCodeDto.email}`,
    )) as any;
    if (!emailRes)
      throw new ForbiddenException(
        'Email verification code expired or check your email.',
      );

    const response = await this.myTwilio.verifyEmailCode(
      emailRes.sid,
      verifyEmailCodeDto.code,
    );

    if (response.status !== 'approved')
      throw new ForbiddenException(
        'Verification code not valid or check your phone number.',
      );

    await this.prisma.user.update({
      where: { id: userId },
      data: { email: verifyEmailCodeDto.email, isEmailVerified: true },
    });
    await this.redis.del(`email_${verifyEmailCodeDto.email}`);
    return { message: 'Your email has been verified successfully' };
  }

  @CacheTTL(1000 * 60 * 10)
  async sendPhoneOTP(
    userId: string,
    verifyPhoneDto: VerifyPhoneDto,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, updatedAt: true, isPhoneVerified: true },
    });
    const diff = calcDateDiff(new Date(), user!.updatedAt);
    if (user?.isPhoneVerified && diff.days <= 1)
      throw new ForbiddenException(
        `Please try again after ${1440 - diff.minutes} minutes.`,
      );
    const response = await this.myTwilio.sendOtpToPhone(verifyPhoneDto.phone);
    await this.redis.set(`phone_${verifyPhoneDto.phone}`, response);
    return response;
  }

  async verifyPhoneOTP(
    userId: string,
    verifyOtpDTO: VerifyPhoneOTPDto,
  ): Promise<CommonMessageResponse> {
    const phoneRes = (await this.redis.get(
      `phone_${verifyOtpDTO.phone}`,
    )) as any;

    if (!phoneRes) throw new ForbiddenException('OTP Expired, resend otp.');
    const response = await this.myTwilio.verifyPhoneOtp(
      phoneRes.sid,
      verifyOtpDTO.otp,
    );

    if (response.status !== 'approved')
      throw new ForbiddenException(
        'Verification code not valid or check your phone number.',
      );

    await this.prisma.user.update({
      where: { id: userId },
      data: { phone: verifyOtpDTO.phone, isPhoneVerified: true },
    });
    await this.redis.del(`phone_${verifyOtpDTO.phone}`);
    return { message: 'Your phone has been verified successfully' };
  }
}
