import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { CloudinaryModule } from 'src/dynamic-modules/cloudinary';

@Module({
  imports: [CloudinaryModule.register({ moduleFolder: 'ideas' })],
  controllers: [IdeasController],
  providers: [IdeasService],
  exports: [IdeasService],
})
export class IdeasModule {}
