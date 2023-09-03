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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from 'src/shared/decorators';
import { Roles } from '@prisma/client';

@Controller('info/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':unique')
  @Public()
  findOne(
    @Param('unique') unique: string,
    @Query('byName', ParseBoolPipe) byName: boolean,
  ) {
    if (byName) {
      return this.roleService.findOneByName(
        Roles[unique.toUpperCase() as keyof typeof Roles],
      );
    }
    return this.roleService.findOne(unique);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
