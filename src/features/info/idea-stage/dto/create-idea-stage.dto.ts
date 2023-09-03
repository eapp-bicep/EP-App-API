import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIdeaStageDto {
  @IsString()
  @IsNotEmpty()
  stage: string;
}
