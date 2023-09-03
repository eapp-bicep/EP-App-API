import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { OnboardingStepService } from './onboarding-step.service';
import { CreateOnboardingStepDto } from './dto/create-onboarding-step.dto';
import { UpdateOnboardingStepDto } from './dto/update-onboarding-step.dto';
import { Public } from 'src/shared/decorators';

@Controller('info/onboarding-step')
export class OnboardingStepController {
  constructor(private readonly onboardingStepService: OnboardingStepService) {}

  @Post()
  create(@Body() createOnboardingStepDto: CreateOnboardingStepDto) {
    return this.onboardingStepService.create(createOnboardingStepDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.onboardingStepService.findAll();
  }

  @Get(':unique')
  @Public()
  findOne(
    @Param('unique') unique: string,
    @Query('byName', ParseBoolPipe) byName: boolean,
  ) {
    if (byName) {
      return this.onboardingStepService.findOneByName(unique);
    }
    return this.onboardingStepService.findOne(unique);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnboardingStepDto: UpdateOnboardingStepDto,
  ) {
    return this.onboardingStepService.update(id, updateOnboardingStepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.onboardingStepService.remove(id);
  }
}
