import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { Cache } from 'cache-manager';

///TODO: Migrate to zoom
///1. Make sure user creates a zoom account for easy management
@Injectable()
export class ZoomService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private redis: Cache,
    private config: ConfigService,
    private http: HttpService,
  ) {}

  async getZoomToken(): Promise<string> {
    try {
      const existingToken = (await this.redis.get('zoomToken')) as {
        access_token: string;
        expires: string;
      };
      if (existingToken) {
        const expiry = DateTime.fromISO(existingToken['expires']);
        if (expiry.diffNow().seconds > 10) {
          return existingToken['access_token'];
        }
      }
      const auth = btoa(
        `${this.config.get('ZOOM_CLIENT_ID')}:${this.config.get(
          'ZOOM_CLIENT_SECRET',
        )}`,
      );
      const { data } = await firstValueFrom(
        this.http.get(
          `https://zoom.us/oauth/token?${this.config.get('ZOOM_ACCOUNT_ID')}`,
          {
            headers: {
              Authorization: `Basic ${auth}`,
            },
          },
        ),
      );
      const expires = DateTime.now().plus({ seconds: data['expires_in'] });
      await this.redis.set('zoomToken', {
        access_token: data['access_token'],
        expires: expires.toISO(),
      });
      return data['access_token'] as string;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
