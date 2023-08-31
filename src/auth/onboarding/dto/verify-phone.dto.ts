import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyPhoneDto {
  @IsPhoneNumber('IN')
  @IsNotEmpty()
  phone: string;
}

export class VerifyPhoneOTPDto extends VerifyPhoneDto {
  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  otp: string;
}
