import { Module } from '@nestjs/common';
import { OccupationService } from './occupation.service';
import { OccupationController } from './occupation.controller';

@Module({
  controllers: [OccupationController],
  providers: [OccupationService],
})
export class OccupationModule {}
