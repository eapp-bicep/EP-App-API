import { PartialType } from '@nestjs/mapped-types';
import { CreateIdeaStageDto } from './create-idea-stage.dto';

export class UpdateIdeaStageDto extends PartialType(CreateIdeaStageDto) {}
