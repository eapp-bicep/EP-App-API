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
import { OccupationService } from './occupation.service';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { UpdateOccupationDto } from './dto/update-occupation.dto';
import { IsAdmin, Public } from 'src/shared/decorators';

@Controller('info/occupation')
@IsAdmin()
export class OccupationController {
  constructor(private readonly occupationService: OccupationService) {}

  @Post()
  create(@Body() createOccupationDto: CreateOccupationDto) {
    return this.occupationService.create(createOccupationDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.occupationService.findAll();
  }

  @Get(':unique')
  @Public()
  findOne(
    @Param('unique') unique: string,
    @Query('byName', ParseBoolPipe) byName: boolean,
  ) {
    if (byName) {
      return this.occupationService.findOneByName(unique);
    }
    return this.occupationService.findOne(unique);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOccupationDto: UpdateOccupationDto,
  ) {
    return this.occupationService.update(id, updateOccupationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.occupationService.remove(id);
  }
}
