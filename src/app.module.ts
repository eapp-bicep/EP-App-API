import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { argonOptions } from './config';
import { PrismaModule, PrismaService } from './prisma';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './shared/guards';
import { AuthModule } from './auth/auth.module';
import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';
// import { TwilioModule } from 'nestjs-twilio';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AccessTokenStrategy, RefreshTokenStrategy } from './auth/strategies';
import { MyTwilioModule } from './my-twilio/my-twilio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [argonOptions] }),
    PrismaModule,
    AuthModule,
    IdeasModule,
    UserModule,
    // TwilioModule.forRootAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: (cfg: ConfigService) => ({
    //     accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
    //     authToken: cfg.get('TWILIO_AUTH_TOKEN'),
    //   }),
    //   inject: [ConfigService],
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: cfg.get('REDIS_HOST'),
            port: cfg.get('REDIS_PORT'),
          },
          ttl: 60 * 60 * 60 * 24,
        }),
      }),
      inject: [ConfigService],
    }),
    MyTwilioModule,
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
