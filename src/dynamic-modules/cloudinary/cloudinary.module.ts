import { DynamicModule, Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';

///Pass moduleFolder parameter to set the module level folder.
@Global()
@Module({
  // providers: [CloudinaryService, CloudinaryProvider],
  // exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: CloudinaryModule,
      providers: [
        {
          provide: 'CLOUDINARY_OPTIONS',
          useValue: options,
        },
        CloudinaryService,
        CloudinaryProvider,
      ],
      exports: [CloudinaryService, CloudinaryProvider],
    };
  }
}
