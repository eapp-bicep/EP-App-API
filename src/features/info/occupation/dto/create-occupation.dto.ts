import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOccupationDto {
  @IsString()
  @IsNotEmpty()
  occupationName: string;
}
