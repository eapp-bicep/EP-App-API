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
import { IdeaStageService } from './idea-stage.service';
import { CreateIdeaStageDto } from './dto/create-idea-stage.dto';
import { UpdateIdeaStageDto } from './dto/update-idea-stage.dto';
import { Public } from 'src/shared/decorators';

@Controller('info/idea-stage')
export class IdeaStageController {
  constructor(private readonly ideaStageService: IdeaStageService) {}

  @Post()
  create(@Body() createIdeaStageDto: CreateIdeaStageDto) {
    return this.ideaStageService.create(createIdeaStageDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.ideaStageService.findAll();
  }

  @Get(':unique')
  @Public()
  findOne(
    @Param('unique') unique: string,
    @Query('byName', ParseBoolPipe) byName: boolean,
  ) {
    if (byName) {
      return this.ideaStageService.findOneByName(unique);
    }
    return this.ideaStageService.findOne(unique);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdeaStageDto: UpdateIdeaStageDto,
  ) {
    return this.ideaStageService.update(id, updateIdeaStageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ideaStageService.remove(id);
  }
}
