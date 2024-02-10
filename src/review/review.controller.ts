import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  SetMetadata,
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
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { ReviewService } from './review.service';
import { ReviewPostRequest } from './swagger/review.post.request';
import { ReviewBadRequest } from './swagger/review.badrequest';
import { ReviewValidationPipe } from './review.validation.pipe';
import { ReviewPostDto } from './dto/review.post.dto';
import { Review } from './entity/review.entity';
import { ReviewDto } from './dto/review.dto';
import {
  ReviewListRequestParamDto,
  ReviewListRequestQueryDto,
} from './dto/review.list.request.dto';
import { ReviewsResponse } from './swagger/review.list.response';
import { ReviewLikeDto } from './dto/review.like.dto';
import { ReviewLikeRequest } from './swagger/review.like.request';
import { ReviewNotfoundResponse } from './swagger/review.notfound.response';
import {
  ReviewUserRequestParamDto,
  ReviewUserRequestQueryDto,
} from './dto/review.user.request.dto';
import { ReviewUserDto } from './dto/review.user.dto';
import { ReviewUserResponse } from './swagger/review.user.response';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('리뷰')
@Controller('/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiBearerAuth('accessToken')
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
    type: ReviewBadRequest,
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

  @Post('/:reviewId/like')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '리뷰 좋아요',
    description: '리뷰에 좋아요를 누릅니다.',
  })
  @ApiBody({ type: ReviewLikeRequest })
  @ApiOkResponse({
    description: '리뷰 좋아요 수를 반환합니다.',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiNotFoundResponse({
    description: 'user 또는 review가 존재하지 않을 때 반환합니다',
    type: ReviewNotfoundResponse,
  })
  async likeReview(
    @Body(new ReviewValidationPipe()) reviewLikeDto: ReviewLikeDto,
  ): Promise<number | null> {
    try {
      return await this.reviewService.likeReview(reviewLikeDto);
    } catch (err) {
      if (err instanceof NotExistException) {
        throw new NotFoundException(err);
      }
      throw new InternalServerErrorException(err);
    }
  }

  @ApiOperation({
    summary: '리뷰 리스트 조회',
    description: '하나의 행사에 달린 리뷰 목록을 반환합니다',
  })
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
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiOkResponse({
    description: '리뷰 리스트를 반환합니다',
    type: ReviewsResponse,
    isArray: true,
  })
  @Public()
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

  @ApiOperation({
    summary: '유저가 리뷰 리스트 조회',
    description: '유저가 작성한 리뷰 목록을 반환합니다',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '유저 아이디',
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
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiOkResponse({
    description: '리뷰 리스트를 반환합니다',
    type: ReviewUserResponse,
    isArray: true,
  })
  @Get('/user/:userId')
  async getUserReviews(
    @Param(new ReviewValidationPipe())
      reviewParamDto: ReviewUserRequestParamDto,
      @Query(new ReviewValidationPipe()) cursor: ReviewUserRequestQueryDto,
  ): Promise<ReviewUserDto[]> {
    try {
      return await this.reviewService.getUserReviews(reviewParamDto, cursor);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
