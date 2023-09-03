import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CommonMessageResponse, ResponseWithData } from 'src/types';
import { PrismaService } from 'src/global/prisma';
import { Role, Roles } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<CommonMessageResponse> {
    await this.prisma.role.create({ data: createRoleDto });
    return {
      message: `Role ${createRoleDto.role} added to the system.`,
    };
  }

  async findAll(): Promise<ResponseWithData<Role[]>> {
    const roles = await this.prisma.role.findMany({
      select: { id: true, role: true },
    });
    return {
      message: `${roles.length} Roles fetched.`,
      data: roles,
    };
  }

  async findOne(id: string): Promise<ResponseWithData<Role>> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: `${role?.role} Role fetched.`,
      data: role,
    };
  }

  async findOneByName(name: Roles): Promise<ResponseWithData<Role>> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { role: name },
    });
    return {
      message: `${role?.role} Role fetched.`,
      data: role,
    };
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<CommonMessageResponse> {
    await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
    return {
      message: `Role ${updateRoleDto.role} updated in the system.`,
    };
  }

  async remove(id: string): Promise<CommonMessageResponse> {
    await this.prisma.role.delete({ where: { id } });
    return { message: 'Removed the role from the system.' };
  }
}
