import { Roles } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from 'src/shared/decorators';

export class SignUpAuthDto {
  //OrSignUpUser DTO

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'Choose a strong password.' },
  )
  @IsNotEmpty()
  password: string;

  @Match('password', { message: "Passwords don't match." })
  @IsNotEmpty()
  confirmPassword: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  @IsString()
  @IsOptional()
  fcmToken: string;
}
