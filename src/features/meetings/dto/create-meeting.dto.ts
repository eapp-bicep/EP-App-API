import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  date: Date;

  // @IsDate()
  // @IsNotEmpty()
  // @Transform(({ value }) => new Date(value))
  // endDateTime: string;

  // @IsNotEmpty()
  // attendees: calendar_v3.Schema$EventAttendee[];
  @IsUUID()
  @IsNotEmpty()
  mentor: string;

  @IsUUID()
  @IsNotEmpty()
  slot: string;
}
