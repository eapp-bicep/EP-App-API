import { Injectable } from '@nestjs/common';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { UpdateOccupationDto } from './dto/update-occupation.dto';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { PrismaService } from 'src/global/prisma';
import { Occupation } from '@prisma/client';

@Injectable()
export class OccupationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createOccupationDto: CreateOccupationDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.occupation.create({ data: createOccupationDto });
    return {
      message: `Occupation ${createOccupationDto.occupationName} added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<Occupation[]>> {
    const occupations = await this.prisma.occupation.findMany({
      select: { id: true, occupationName: true },
    });
    return {
      message: `${occupations.length} Occupations fetched.`,
      data: occupations,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<Occupation>> {
    const occupation = await this.prisma.occupation.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `${occupation?.occupationName} Occupation fetched.`,
      data: occupation,
    };
  }

  async findOneByName(name: string): Promise<ResponseWithData<Occupation>> {
    const occupation = await this.prisma.occupation.findUniqueOrThrow({
      where: { occupationName: name },
    });
    return {
      message: `${occupation?.occupationName} Occupation fetched.`,
      data: occupation,
    };
  }

  async update(
    id: string,
    updateOccupationDto: UpdateOccupationDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.occupation.update({
      where: { id },
      data: updateOccupationDto,
    });
    return {
      message: `Occupation ${updateOccupationDto.occupationName} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.occupation.delete({ where: { id } });
    return { message: 'Removed the occupation from the system.' };
  }
}
