import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
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
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
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
import { ReviewUpdateRequest } from './swagger/review.update.request';
import { ReviewUpdateDto } from './dto/review.update.dto';
import { ReviewImageRequest } from './swagger/review.image.request';
import { ReviewImageDto } from './dto/review.image.dto';
import { ReviewClaimDto } from './dto/review.claim.dto';
import { ReviewClaimRequest } from './swagger/review.claim.request';
import { PrivateReviewDto } from './dto/riview.private.dto';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('리뷰')
@Controller('/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/:reviewId/users/:userId')
  @ApiBearerAuth('accessToken')
  @ApiParam({
    name: 'reviewId',
    description: '06258a5c-3109-44fe-bb57-e863583cfd34',
  })
  @ApiParam({
    name: 'userId',
    description: 'cce311df-1c7e-49dd-8585-3a8217555eb1',
  })
  @ApiOperation({
    summary: '리뷰 조회',
    description: '리뷰 아이디, 유저 아이디로 하나의 리뷰를 조회합니다',
  })
  @ApiOkResponse({
    description: '하나의 리뷰를 반환합니다',
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiNotFoundResponse({
    description: '유저 또는 리뷰가 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async getReview(
    @Param('reviewId') reviewId: string,
      @Param('userId') userId: string,
  ): Promise<Review | null> {
    try {
      return await this.reviewService.getReview(reviewId, userId);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Delete('/:reviewId/images')
  @ApiBearerAuth('accessToken')
  @ApiParam({
    name: 'reviewId',
    description: '107e606f-0b0b-4652-8cb3-c091fb80eff5',
  })
  @ApiOperation({
    summary: '리뷰 이미지 삭제',
    description: '기존 리뷰에 이미지를 삭제합니다',
  })
  @ApiBody({ type: ReviewImageRequest })
  @ApiOkResponse({
    description: '이미지가 삭제 되었을 때 반환합니다',
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiNotFoundResponse({
    description: '유저 또는 리뷰가 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async deleteReviewImage(
    @Param('reviewId') reviewId: string,
      @Body(new ReviewValidationPipe()) reviewImageDto: ReviewImageDto,
  ): Promise<number | null> {
    try {
      return await this.reviewService.deleteReviewImage(
        reviewId,
        reviewImageDto,
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('/:reviewId/claims')
  @ApiBearerAuth('accessToken')
  @ApiParam({
    name: 'reviewId',
    description: '107e606f-0b0b-4652-8cb3-c091fb80eff5',
  })
  @ApiOperation({
    summary: '리뷰 신고',
    description: '기존 리뷰를 신고합니다',
  })
  @ApiBody({ type: ReviewClaimRequest })
  @ApiCreatedResponse({
    description: '신고 내용이 저장되었을 때 반환합니다',
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiNotFoundResponse({
    description: '유저 또는 리뷰가 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async addReviewClaim(
    @Param('reviewId') reviewId: string,
      @Body(new ReviewValidationPipe()) reviewClaimDto: ReviewClaimDto,
  ): Promise<string | null> {
    try {
      return await this.reviewService.addClaim(reviewId, reviewClaimDto);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('/:reviewId/images')
  @ApiBearerAuth('accessToken')
  @ApiParam({
    name: 'reviewId',
    description: '107e606f-0b0b-4652-8cb3-c091fb80eff5',
  })
  @ApiOperation({
    summary: '리뷰 이미지 추가',
    description: '기존 리뷰에 이미지를 추가합니다',
  })
  @ApiBody({ type: ReviewImageRequest })
  @ApiCreatedResponse({
    description: '이미지가 추가 되었을 때 반환합니다',
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiNotFoundResponse({
    description: '유저 또는 리뷰가 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async addReviewImage(
    @Param('reviewId') reviewId: string,
      @Body(new ReviewValidationPipe()) reviewImageDto: ReviewImageDto,
  ): Promise<string | null> {
    try {
      return await this.reviewService.addReviewImage(reviewId, reviewImageDto);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Patch()
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '리뷰 수정',
    description: '기존 리뷰를 수정합니다',
  })
  @ApiBody({ type: ReviewUpdateRequest })
  @ApiOkResponse({
    description: '리뷰가 수정되었을 때 반환합니다',
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ReviewBadRequest,
  })
  @ApiNotFoundResponse({
    description: '행사 또는 리뷰가 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async updateReview(
    @Body(new ReviewValidationPipe()) reviewUpdateDto: ReviewUpdateDto,
  ): Promise<Review[]> {
    try {
      return await this.reviewService.updateReview(reviewUpdateDto);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

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
    schema: {
      default: '0396d2c0-457d-49',
    },
  })
  @ApiQuery({
    name: 'cursorId',
    required: true,
    description: '현재 페이지 번호',
    schema: {
      default: 500,
    },
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    example: 'cce311df-1c7e-49dd-8585-3a8217555eb1',
    description: '로그인 했을 때 유저의 아이디',
  })
  @ApiQuery({
    name: 'size',
    required: true,
    description: '한 페이지당 리뷰 갯수',
    schema: {
      default: 10,
    },
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
  ): Promise<ReviewDto[] | PrivateReviewDto[]> {
    try {
      return await this.reviewService.getReviews(reviewParamDto, cursor);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '유저 리뷰 리스트 조회',
    description: '유저가 작성한 리뷰 목록을 반환합니다',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: '유저 아이디',
    schema: {
      default: '4a256531-6f40-41de-aba2-d37d7507e5d7',
    },
  })
  @ApiQuery({
    name: 'cursorId',
    required: true,
    description: '현재 페이지 번호',
    schema: {
      default: 500,
    },
  })
  @ApiQuery({
    name: 'size',
    required: true,
    description: '한 페이지당 리뷰 갯수',
    schema: {
      default: 5,
    },
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
