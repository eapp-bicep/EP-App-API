import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOnboardingStepDto {
  @IsUUID()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  stepName: string;
}
