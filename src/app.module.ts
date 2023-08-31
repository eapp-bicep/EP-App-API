import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { argonOptions } from './config';
import { PrismaModule, PrismaService } from './prisma';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './shared/guards';
import { AuthModule } from './auth/auth.module';
import { IdeasModule } from './ideas/ideas.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [argonOptions] }),
    PrismaModule,
    AuthModule,
    IdeasModule,
    UserModule,
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
