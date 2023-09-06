import { RatingType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  @IsNotEmpty()
  rateFor: string;

  @IsEnum(RatingType)
  @IsNotEmpty()
  ratingType: RatingType;

  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
