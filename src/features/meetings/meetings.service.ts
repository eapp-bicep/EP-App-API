import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import {
  UpdateMeetingDto,
  UpdateMeetingStatusDto,
} from './dto/update-meeting.dto';
import { GoogleService } from 'src/global/google';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';
import { PrismaService } from 'src/global/prisma';
import { Meeting, MeetingRequestStatus, Roles, User } from '@prisma/client';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { DateTime } from 'luxon';

@Injectable()
export class MeetingsService {
  constructor(
    private google: GoogleService,
    private prisma: PrismaService,
  ) {}

  async create(
    user: User,
    createMeetingDto: CreateMeetingDto,
  ): Promise<ResponseWithData<Meeting>> {
    const mentor = await this.prisma.user.findUniqueOrThrow({
      where: { id: createMeetingDto.mentor, role: { role: Roles.MENTOR } },
      select: { email: true, id: true },
    });
    const slot = await this.prisma.slot.findUniqueOrThrow({
      where: { id: createMeetingDto.slot },
    });

    const exists = await this.prisma.meeting.findFirst({
      where: {
        scheduledByUserId: user.id,
        scheduledWithUserId: mentor.id,
        slotId: slot.id,
      },
    });

    if (exists)
      throw new ForbiddenException(
        'You have already scheduled a meeting at that slot. Please cancel it before scheduling another at the same time.',
      );

    const startDateTime = DateTime.fromJSDate(createMeetingDto.date).set({
      minute: slot.slotTime.getMinutes(),
      hour: slot.slotTime.getHours(),
    });

    const endDateTime = startDateTime.plus({ minute: slot.duration });

    const event: calendar_v3.Schema$Event = {
      summary: createMeetingDto.summary,
      location: 'Online',
      description: createMeetingDto.description,
      start: {
        dateTime: startDateTime.toISO(),
        timeZone: 'Asia/Calcutta',
      },
      end: {
        dateTime: endDateTime.toISO(),
        timeZone: 'Asia/Calcutta',
      },
      //TODO: For now only between two people.
      attendees: [
        { email: user.email, organizer: true, responseStatus: 'accepted' },
        { email: mentor.email },
      ],

      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
          requestId: `${user.id}-${mentor.id}`,
        },
      },
    };

    const res = await this.google.gCalendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meeting = await this.prisma.meeting.create({
      data: {
        summary: createMeetingDto.summary,
        description: createMeetingDto.description,
        meetingLink: res.data.hangoutLink ?? '',
        requestId: res.data.id,
        htmlLink: res.data.htmlLink,
        scheduledBy: { connect: { id: user.id } },
        scheduledWith: { connect: { id: mentor.id } },
        slot: { connect: { id: slot.id } },
      },
    });
    return { message: 'Meeting has been scheduled.', data: meeting };
  }

  async findAll(userId: string): Promise<ResponseWithData<Meeting[]>> {
    //User meetings
    const meetings = await this.prisma.meeting.findMany({
      where: { scheduledByUserId: userId },
    });
    return { message: `You have ${meetings.length} meetings.`, data: meetings };
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<ResponseWithData<Meeting>> {
    const meeting = await this.prisma.meeting.findUniqueOrThrow({
      where: { id, scheduledByUserId: userId },
    });
    return { message: `Fetched the meeting.`, data: meeting };
  }

  async updateStatus(
    id: string,
    updateMeetingDto: UpdateMeetingStatusDto,
  ): Promise<CommonMessageResponse> {
    const meeting = await this.prisma.meeting.findUnique({
      where: {
        id,
      },
    });

    if (!meeting) throw new NotFoundException('No such meeting exists.');

    if (meeting.requestStatus == MeetingRequestStatus.FINISHED)
      throw new ForbiddenException(
        'Meeting has already been marked as finished.',
      );
    if (meeting.requestStatus == MeetingRequestStatus.CANCELLED)
      throw new ForbiddenException(
        'Meeting has been cancelled, you cannot modify the status.',
      );

    const diff = DateTime.fromJSDate(meeting.dateTime).diffNow(
      'minutes',
    ).minutes;

    if (updateMeetingDto.status == MeetingRequestStatus.FINISHED && diff < 10)
      throw new ForbiddenException(
        `Please wait for ${10 - diff} minutes to update the status.`,
      );
    if (updateMeetingDto.status == MeetingRequestStatus.CANCELLED && diff < 0)
      throw new ForbiddenException('You cannot cancel the meeting now.');

    await this.prisma.meeting.update({
      where: {
        id,
      },
      data: {
        requestStatus: updateMeetingDto.status,
      },
    });
    return {
      message: `Meeting has been marked as ${updateMeetingDto.status.toLowerCase()}, thank you.`,
    };
  }

  async finishMeeting(id: string): Promise<CommonMessageResponse> {
    await this.prisma.meeting.update({
      where: { id },
      data: { requestStatus: MeetingRequestStatus.FINISHED },
    });
    return { message: 'Meeting has been marked as finished.' };
  }

  async cancelMeeting(id: string): Promise<CommonMessageResponse> {
    //Cancel Meeting
    const meeting = await this.prisma.meeting.findUniqueOrThrow({
      where: { id },
    });
    await this.google.gCalendar.events.delete({
      calendarId: 'primary',
      eventId: `${meeting.requestId}`,
    });
    await this.prisma.meeting.update({
      where: { id },
      data: {
        requestStatus: MeetingRequestStatus.CANCELLED,
      },
    });
    return { message: 'Meeting cancelled.' };
  }
}
