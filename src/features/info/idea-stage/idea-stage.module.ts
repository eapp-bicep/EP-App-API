import { Module } from '@nestjs/common';
import { IdeaStageService } from './idea-stage.service';
import { IdeaStageController } from './idea-stage.controller';

@Module({
  controllers: [IdeaStageController],
  providers: [IdeaStageService]
})
export class IdeaStageModule {}
