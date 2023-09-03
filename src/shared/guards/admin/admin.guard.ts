import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { PrismaService } from 'src/global/prisma';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const { user } = context.switchToHttp().getRequest();
    const adminRoleId = await this.prisma.role.findUnique({
      where: { role: Roles.ADMIN },
      select: { id: true },
    });
    if (user.roleId !== adminRoleId?.id)
      throw new ForbiddenException('You are not authorized.');
    return true;
  }
}
