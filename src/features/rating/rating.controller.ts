import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RatingService } from './rating.service';
import { GetCurrentUser } from 'src/shared/decorators';
import { CreateRatingDto } from './dto';

@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post('/mentor')
  createMentorRating(
    @GetCurrentUser('id') userId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingService.createMentorRating(userId, createRatingDto);
  }

  @Get('/mentor/:id')
  getMentorRating(@Param('id') mentorId: string) {
    return this.ratingService.getMentorAverage(mentorId);
  }
}
