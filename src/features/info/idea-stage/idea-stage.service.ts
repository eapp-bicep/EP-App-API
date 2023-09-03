import { Injectable } from '@nestjs/common';
import { CreateIdeaStageDto } from './dto/create-idea-stage.dto';
import { UpdateIdeaStageDto } from './dto/update-idea-stage.dto';
import { PrismaService } from 'src/global/prisma';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { IdeaStage } from '@prisma/client';

@Injectable()
export class IdeaStageService {
  constructor(private prisma: PrismaService) {}

  async create(
    createIdeaStageDto: CreateIdeaStageDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.ideaStage.create({ data: createIdeaStageDto });
    return {
      message: `IdeaStage ${createIdeaStageDto.stage} added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<IdeaStage[]>> {
    const ideaStages = await this.prisma.ideaStage.findMany({});
    return {
      message: `${ideaStages.length} IdeaStages fetched.`,
      data: ideaStages,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<IdeaStage>> {
    const ideaStage = await this.prisma.ideaStage.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `${ideaStage?.stage} IdeaStage fetched.`,
      data: ideaStage,
    };
  }

  async findOneByName(name: string): Promise<ResponseWithData<IdeaStage>> {
    const ideaStage = await this.prisma.ideaStage.findFirstOrThrow({
      where: { stage: name },
    });
    return {
      message: `${ideaStage?.stage} IdeaStage fetched.`,
      data: ideaStage,
    };
  }

  async update(
    id: string,
    updateIdeaStageDto: UpdateIdeaStageDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.ideaStage.update({
      where: { id },
      data: updateIdeaStageDto,
    });
    return {
      message: `IdeaStage ${updateIdeaStageDto.stage} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.ideaStage.delete({ where: { id } });
    return { message: 'Removed the ideaStage from the system.' };
  }
}
