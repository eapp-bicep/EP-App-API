import { Injectable } from '@nestjs/common';
import { CreateOnboardingStepDto } from './dto/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dto/update-onboarding-step.dto';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { PrismaService } from 'src/global/prisma';
import { OnboardingStepOnRole } from '@prisma/client';

@Injectable()
export class OnboardingStepService {
  constructor(private prisma: PrismaService) {}

  async create(
    createOnboardingStepDto: CreateOnboardingStepDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.onboardingStepOnRole.create({
      data: {
        stepName: createOnboardingStepDto.stepName,
        role: { connect: { id: createOnboardingStepDto.role } },
      },
    });
    return {
      message: `OnboardingStep ${createOnboardingStepDto.stepName} added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<OnboardingStepOnRole[]>> {
    const onboardingSteps = await this.prisma.onboardingStepOnRole.findMany({
      include: { role: { select: { id: true, role: true } } },
    });
    return {
      message: `${onboardingSteps.length} OnboardingSteps fetched.`,
      data: onboardingSteps,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<OnboardingStepOnRole>> {
    const onboardingStep =
      await this.prisma.onboardingStepOnRole.findUniqueOrThrow({
        where: { id },
      });
    return {
      message: `${onboardingStep?.stepName} OnboardingStep fetched.`,
      data: onboardingStep,
    };
  }

  async findOneByName(
    name: string,
  ): Promise<ResponseWithData<OnboardingStepOnRole>> {
    const onboardingStep =
      await this.prisma.onboardingStepOnRole.findFirstOrThrow({
        where: { stepName: name },
      });
    return {
      message: `${onboardingStep?.stepName} OnboardingStep fetched.`,
      data: onboardingStep,
    };
  }

  async update(
    id: string,
    updateOnboardingStepDto: UpdateOnboardingStepDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.onboardingStepOnRole.update({
      where: { id },
      data: {
        stepName: updateOnboardingStepDto.stepName,
        role: { connect: { id: updateOnboardingStepDto.role } },
      },
    });
    return {
      message: `OnboardingStep ${updateOnboardingStepDto.stepName} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.onboardingStepOnRole.delete({ where: { id } });
    return { message: 'Removed the onboardingStep from the system.' };
  }
}
