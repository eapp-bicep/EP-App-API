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
import { SegmentService } from './segment.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { IsAdmin, Public } from 'src/shared/decorators';

@Controller('info/segment')
@IsAdmin()
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  create(@Body() createSegmentDto: CreateSegmentDto) {
    return this.segmentService.create(createSegmentDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.segmentService.findAll();
  }

  @Get(':unique')
  @Public()
  findOne(
    @Param('unique') unique: string,
    @Query('byName', ParseBoolPipe) byName: boolean,
  ) {
    if (byName) {
      return this.segmentService.findOneByName(unique);
    }
    return this.segmentService.findOne(unique);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSegmentDto: UpdateSegmentDto) {
    return this.segmentService.update(id, updateSegmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.segmentService.remove(id);
  }
}
