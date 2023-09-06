import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class SaveProfessionalInfoDto {
  @IsString()
  @IsNotEmpty()
  linkedIn: string;

  @IsUUID()
  @IsNotEmpty()
  segment: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  priorMentorExperience: boolean;

  @IsString()
  @IsNotEmpty()
  currentJobTitle: string;

  @IsString()
  @IsNotEmpty()
  organization: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value))
  timeInvestment: number;

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  fieldsOfInterest: string[]; //Segment Ids
}
