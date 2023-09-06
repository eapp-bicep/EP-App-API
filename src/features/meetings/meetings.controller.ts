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
import { UpdateMeetingDto } from './dto/update-meeting.dto';
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

  @Get(':id')
  findOne(@GetCurrentUser('id') userId: string, @Param('id') id: string) {
    return this.meetingsService.findOne(userId, id);
  }

  @Patch(':id/finish')
  finishMeeting(@Param('id') id: string) {
    return this.meetingsService.finishMeeting(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.update(+id, updateMeetingDto);
  }

  @Delete(':id')
  cancelMeeting(@Param('id') id: string) {
    return this.meetingsService.cancelMeeting(id);
  }
}
