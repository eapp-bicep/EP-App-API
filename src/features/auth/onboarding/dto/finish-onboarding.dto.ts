import { Roles, User } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FinishOnboardingDto {
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
