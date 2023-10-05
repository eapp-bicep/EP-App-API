import { Global, Module } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [ZoomService],
})
export class ZoomModule {}
