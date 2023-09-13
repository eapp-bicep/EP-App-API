import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingDto } from './create-meeting.dto';
import { MeetingRequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {}

export class UpdateMeetingStatusDto {
  @IsNotEmpty()
  @IsEnum(MeetingRequestStatus)
  status: MeetingRequestStatus;
}
