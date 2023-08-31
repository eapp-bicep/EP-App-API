import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [OnboardingModule],
})
export class AuthModule {}
