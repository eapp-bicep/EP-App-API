import { Injectable } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { PrismaService } from 'src/global/prisma';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { Segment } from '@prisma/client';
import { Public } from 'src/shared/decorators';

@Injectable()
export class SegmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    createSegmentDto: CreateSegmentDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.segment.create({ data: createSegmentDto });
    return {
      message: `Segment ${createSegmentDto.segmentName} added to the system.`,
    };
  }

  @Public()
  async findAll(): Promise<ResponseWithData<Segment[]>> {
    const segments = await this.prisma.segment.findMany({
      select: { id: true, segmentName: true },
    });
    return {
      message: `${segments.length} Segments fetched.`,
      data: segments,
    };
  }

  @Public()
  async findOne(id: string): Promise<ResponseWithData<Segment>> {
    const segment = await this.prisma.segment.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `${segment?.segmentName} Segment fetched.`,
      data: segment,
    };
  }

  @Public()
  async findOneByName(name: string): Promise<ResponseWithData<Segment>> {
    const segment = await this.prisma.segment.findUniqueOrThrow({
      where: { segmentName: name },
    });
    return {
      message: `${segment?.segmentName} Segment fetched.`,
      data: segment,
    };
  }

  async update(
    id: string,
    updateSegmentDto: UpdateSegmentDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.segment.update({
      where: { id },
      data: updateSegmentDto,
    });
    return {
      message: `Segment ${updateSegmentDto.segmentName} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.segment.delete({ where: { id } });
    return { message: 'Removed the segment from the system.' };
  }
}
