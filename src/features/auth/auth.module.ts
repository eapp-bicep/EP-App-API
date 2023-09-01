import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OnboardingModule } from './onboarding';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/features/user';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, OnboardingModule, JwtModule.register({})],
})
export class AuthModule {}
