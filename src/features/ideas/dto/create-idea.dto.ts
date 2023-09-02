import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  problemStatement: string;

  @IsUUID()
  @IsNotEmpty()
  ideaStage: string;

  @IsUUID()
  @IsNotEmpty()
  segment: string;

  @IsString()
  @IsNotEmpty()
  proposedSolution: string;
}
