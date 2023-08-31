import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';

@Module({
  providers: [OnboardingService],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
