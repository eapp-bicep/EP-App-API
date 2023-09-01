import { PartialType } from '@nestjs/mapped-types';
import { SignUpAuthDto } from './sign-up-auth.dto';

export class LoginAuthDto extends PartialType(SignUpAuthDto) {
}
