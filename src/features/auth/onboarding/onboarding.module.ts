import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { UserModule } from 'src/features/user';
import { IdeasModule } from 'src/features/ideas';

@Module({
  imports: [UserModule, IdeasModule],
  providers: [OnboardingService],
  controllers: [OnboardingController],
  exports: [OnboardingService],
})
export class OnboardingModule {}
