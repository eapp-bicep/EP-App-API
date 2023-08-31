import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
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

  @Match('password')
  @IsNotEmpty()
  confirmPassword: string;
}
