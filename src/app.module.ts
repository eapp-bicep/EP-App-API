import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { argonOptions } from './config';
import { PrismaModule, PrismaService } from './prisma';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './shared/guards';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [argonOptions] }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
