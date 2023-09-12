import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard
  extends AuthGuard('jwt-access')
  implements CanActivate
{
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true; //Pass all traffic
    const req = context.switchToHttp().getRequest();

    const accessToken =
      req.get('authorization')?.replace('Bearer', '').trim() ?? '';

    try {
      await this.jwt.verify(accessToken, {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('Token expired');
    }
    return super.canActivate(context); //or else normal behavior
  }
}
