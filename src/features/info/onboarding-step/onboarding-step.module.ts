import { Module } from '@nestjs/common';
import { OnboardingStepService } from './onboarding-step.service';
import { OnboardingStepController } from './onboarding-step.controller';

@Module({
  controllers: [OnboardingStepController],
  providers: [OnboardingStepService]
})
export class OnboardingStepModule {}
