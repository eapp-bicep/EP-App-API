import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'src/global/prisma';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const adminRoleId = await this.prisma.role.findUnique({
      where: { role: Roles.ADMIN },
    });
    if (user.roleId !== adminRoleId)
      throw new ForbiddenException('You are not authorized.');
    return true;
  }
}
