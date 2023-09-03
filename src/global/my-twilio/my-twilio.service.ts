import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { VerificationListInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckListInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';

@Injectable()
export class MyTwilioService {
  private twilioVerifications: VerificationListInstance;
  private twilioVerificationCheck: VerificationCheckListInstance;

  constructor(
    @Inject(CACHE_MANAGER) private redis: Cache,
    private readonly twilioService: TwilioService,
    private config: ConfigService,
  ) {
    this.twilioVerifications = twilioService.client.verify.v2.services(
      config.get('TWILIO_VERIFY_SERVICE_SID') ?? '',
    ).verifications;

    this.twilioVerificationCheck = twilioService.client.verify.v2.services(
      config.get('TWILIO_VERIFY_SERVICE_SID') ?? '',
    ).verificationChecks;
  }

  async sendCodeToEmail(email: string) {
    const response = await this.twilioVerifications.create({
      to: email,
      channel: 'email',
    });
    return response;
  }

  async verifyEmailCode(verificationSid: string, code: string) {
    const response = await this.twilioVerificationCheck.create({
      verificationSid,
      code,
    });

    return response;
  }

  async sendOtpToPhone(phone: string) {
    const response = await this.twilioVerifications.create({
      to: `+91${phone}`,
      channel: 'sms',
    });
    return response;
  }

  async verifyPhoneOtp(verificationSid: string, otp: string) {
    const response = await this.twilioVerificationCheck.create({
      verificationSid,
      code: otp,
    });

    return response;
  }
}
