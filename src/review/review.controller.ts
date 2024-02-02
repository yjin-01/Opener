import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { ReviewPostRequest } from './swagger/review.post.request';
import { ReviewPostBadRequest } from './swagger/review.post.badrequest';
import { ReviewValidationPipe } from './review.validation.pipe';
import { ReviewPostDto } from './dto/review.post.dto';
import { Review } from './entity/review.entity';
import { ReviewDto } from './dto/review.dto';
import {
  ReviewListRequestParamDto,
  ReviewListRequestQueryDto,
} from './dto/review.list.request.dto';
import { ReviewListResponse } from './swagger/review.list.response';

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
  ): Promise<Review[]> {
    try {
      return await this.reviewService.createReview(reviewPostDto);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @ApiParam({
    name: 'eventId',
    required: true,
    description: '리뷰가 달린 행사 아이디',
  })
  @ApiQuery({
    name: 'cursorId',
    required: true,
    description: '현재 페이지 번호',
  })
  @ApiQuery({
    name: 'size',
    required: true,
    description: '한 페이지당 리뷰 갯수',
  })
  @ApiOkResponse({
    description: '리뷰 리스트를 반환합니다',
    type: ReviewListResponse,
  })
  @Get(':eventId')
  async getReviews(
    @Param(new ReviewValidationPipe())
      reviewParamDto: ReviewListRequestParamDto,
      @Query(new ReviewValidationPipe()) cursor: ReviewListRequestQueryDto,
  ): Promise<ReviewDto[]> {
    try {
      return await this.reviewService.getReviews(reviewParamDto, cursor);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
