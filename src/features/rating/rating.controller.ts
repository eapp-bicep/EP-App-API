import { Body, Controller, Post } from '@nestjs/common';
import { RatingService } from './rating.service';
import { GetCurrentUser } from 'src/shared/decorators';
import { CreateRatingDto } from './dto';

@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post()
  createRating(
    @GetCurrentUser('id') userId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingService.createRating(userId, createRatingDto);
  }
}
