import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { CloudinaryService } from 'src/dynamic-modules/cloudinary';

const createPrismaExtended = (
  prisma: PrismaService,
  cloudinaryService: CloudinaryService,
) =>
  prisma.$extends({
    name: 'myExt',
    query: {
      personalInfo: {
        async delete({ args, query }) {
          args.include = {
            profileImage: { select: { id: true, imgFullPath: true } },
          };
          const result = await query(args);
          if (result && result.profileImage)
            await cloudinaryService.deleteFile(
              result!.profileImage!.imgFullPath ?? '',
            );
          return result;
        },
      },
      professionalInformation: {
        async delete({ args, query }) {
          args.include = {
            resume: { select: { id: true, imgFullPath: true } },
          };
          const result = await query(args);
          if (result && result.resume)
            await cloudinaryService.deleteFile(
              result!.resume!.imgFullPath ?? '',
            );
          return result;
        },
      },
      document: {
        async delete({ args, query }) {
          const result = await query(args);
          if (result)
            await cloudinaryService.deleteFile(result!.imgFullPath ?? '');
          return result;
        },
      },
    },
  });

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _prisma: ReturnType<typeof createPrismaExtended>;

  constructor(
    config: ConfigService,
    private cloudinary: CloudinaryService,
  ) {
    super({ datasources: { db: { url: config.get('DATABASE_URL') } } });
  }

  get extended() {
    if (!this._prisma) {
      this._prisma = createPrismaExtended(this, this.cloudinary);
    }

    return this._prisma;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
