import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OnboardingModule } from './onboarding/onboarding.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [OnboardingModule, JwtModule.register({})],
})
export class AuthModule {}
