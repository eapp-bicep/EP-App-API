import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyEmailCodeDto extends VerifyEmailDto {
  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;
}
