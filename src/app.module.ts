import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { argonOptions } from './config';
import { PrismaModule, PrismaService } from './global/prisma';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './shared/guards';
import { AuthModule } from './features/auth/auth.module';
import { IdeasModule } from './features/ideas/ideas.module';
import { UserModule } from './features/user/user.module';
// import { TwilioModule } from 'nestjs-twilio';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './features/auth/strategies';
import { MyTwilioModule } from './global/my-twilio/my-twilio.module';
import { CloudinaryModule } from './dynamic-modules/cloudinary/cloudinary.module';
import { InfoModule } from './features/info/info.module';
import { MeetingsModule } from './features/meetings/meetings.module';
import { GoogleModule } from './global/google/google.module';
import { RatingModule } from './features/rating/rating.module';
import { JwtModule } from '@nestjs/jwt';
import { ZoomModule } from './global/zoom/zoom.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [argonOptions] }),
    PrismaModule,
    AuthModule,
    IdeasModule,
    UserModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          // socket: {

          //   host: cfg.get('REDIS_HOST'),
          //   port: cfg.get('REDIS_PORT'),

          // },
          url: cfg.get('REDIS_URL'),
          ttl: 60 * 60 * 60 * 24,
        }),
      }),
      inject: [ConfigService],
    }),
    MyTwilioModule,
    CloudinaryModule,
    InfoModule,
    MeetingsModule,
    GoogleModule,
    RatingModule,
    //Not global because only the accessToken guard needs it
    JwtModule.register({}),
    ZoomModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
