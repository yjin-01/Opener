import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { ReviewPostRequest } from './swagger/review.post.request';
import { ReviewPostBadRequest } from './swagger/review.post.badrequest';
import { ReviewValidationPipe } from './review.validation.pipe';
import { ReviewPostDto } from './dto/review.post.dto';

@ApiTags('리뷰')
@Controller('/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({
    summary: '리뷰 등록',
    description: '새로운 리뷰가 등록됩니다',
  })
  @ApiBody({ type: ReviewPostRequest })
  @ApiCreatedResponse({
    description: '리뷰가 생성되었을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewPostBadRequest,
  })
  async postReview(
    @Body(new ReviewValidationPipe()) reviewPostDto: ReviewPostDto,
  ): Promise<null> {
    try {
      return await this.reviewService.createReview(reviewPostDto);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Get()
  getHello(): string {
    console.log('test');
    return this.reviewService.getHello();
  }
}
