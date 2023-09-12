import { Injectable } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { PrismaService } from 'src/global/prisma';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { Slot } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class SlotService {
  constructor(private prisma: PrismaService) {}

  async create(createSlotDto: CreateSlotDto): Promise<any> {
    // const date = DateTime.fromFormat(createSlotDto.slotTime, 'h:m');
    const date = DateTime.fromJSDate(createSlotDto.slotTime);
    // return { message: date.toSQLTime() };
    await this.prisma.slot.create({
      data: {
        duration: createSlotDto.duration,
        slotTime: date.toISO() ?? '',
      },
    });
    return {
      message: `Slot added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<Slot[]>> {
    const slots = await this.prisma.slot.findMany({});
    return {
      message: `${slots.length} Slots fetched.`,
      data: slots,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<Slot>> {
    const slot = await this.prisma.slot.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `Slot fetched.`,
      data: slot,
    };
  }

  async update(
    id: string,
    updateSlotDto: UpdateSlotDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.slot.update({
      where: { id },
      data: {
        duration: updateSlotDto.duration,
        // slotTime: updateSlotDto
        //   ? updateSlotDto!.slotTime!.toSQLTime() ?? ''
        //   : '',
      },
    });
    return {
      message: `Slot updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.slot.delete({ where: { id } });
    return { message: 'Removed the slot from the system.' };
  }
}
