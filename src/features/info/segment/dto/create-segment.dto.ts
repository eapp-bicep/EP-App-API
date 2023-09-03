import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  @IsNotEmpty()
  segmentName: string;
}
