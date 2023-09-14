import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import {
  UpdateMeetingDto,
  UpdateMeetingStatusDto,
} from './dto/update-meeting.dto';
import { GetCurrentUser } from 'src/shared/decorators';
import { User } from '@prisma/client';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(
    @GetCurrentUser() user: User,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return this.meetingsService.create(user, createMeetingDto);
  }

  @Get()
  findAll(@GetCurrentUser('id') userId: string) {
    return this.meetingsService.findAll(userId);
  }

  @Get('/mentor')
  findInvitedMeetings(@GetCurrentUser('id') mentorId: string) {
    return this.meetingsService.findInvitedMeetings(mentorId);
  }

  @Get(':id')
  findOne(@GetCurrentUser('id') userId: string, @Param('id') id: string) {
    return this.meetingsService.findOne(userId, id);
  }

  @Patch(':id/finish')
  finishMeeting(@Param('id') id: string) {
    return this.meetingsService.finishMeeting(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingStatusDto,
  ) {
    return this.meetingsService.updateStatus(id, updateMeetingDto);
  }

  @Delete(':id')
  cancelMeeting(@Param('id') id: string) {
    return this.meetingsService.cancelMeeting(id);
  }
}
