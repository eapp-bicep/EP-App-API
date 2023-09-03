import { Roles } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
