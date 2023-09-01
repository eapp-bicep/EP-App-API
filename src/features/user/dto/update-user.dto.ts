import { PartialType } from '@nestjs/mapped-types';
import { SaveUserProfileDto } from './save-user-profile.dto';

export class UpdateUserDto extends PartialType(SaveUserProfileDto) {}
