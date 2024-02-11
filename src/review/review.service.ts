import { Injectable, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventRepository } from 'src/event/event.repository';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { UserRepository } from 'src/user/interface/user.repository';
import { ReviewRepository } from './review.repository';
import { ReviewDto } from './dto/review.dto';
import {
  ReviewUserRequestParamDto,
  ReviewUserRequestQueryDto,
} from './dto/review.user.request.dto';
import { ReviewUserDto } from './dto/review.user.dto';
import {
  ReviewListRequestParamDto,
  ReviewListRequestQueryDto,
} from './dto/review.list.request.dto';
import { ReviewUpdateDto } from './dto/review.update.dto';
import { ReviewImageDto } from './dto/review.image.dto';
import { Review } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
    private readonly eventRepository: EventRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async exists(reviewId: string, userId: string): Promise<void> {
    const [review, user] = await Promise.all([
      this.reviewRepository.findOneByReviewId(reviewId),
      this.userRepository.findById(userId),
    ]);

    if (!review || !user) {
      throw new NotExistException('not exist field');
    }
  }

  async getReview(reviewId: string, userId: string): Promise<Review | null> {
    try {
      await this.exists(reviewId, userId);
      return await this.reviewRepository.findWithImages(reviewId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteReviewImage(
    reviewId: string,
    reviewImageDto: ReviewImageDto,
  ): Promise<number | null> {
    try {
      await this.exists(reviewId, reviewImageDto.getUserId());
      return await this.reviewRepository.deleteImages(reviewId, reviewImageDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addReviewImage(
    reviewId: string,
    reviewImageDto: ReviewImageDto,
  ): Promise<string | null> {
    try {
      await this.exists(reviewId, reviewImageDto.getUserId());
      return await this.reviewRepository.createImages(reviewId, reviewImageDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createReview(reviewPostDto): Promise<any> {
    try {
      return await this.reviewRepository.create(reviewPostDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateReview(reviewUpdateDto: ReviewUpdateDto): Promise<any> {
    try {
      const [event, user, review] = await Promise.all([
        this.eventRepository.findOneEventByEventId(
          reviewUpdateDto.getEventId(),
        ),
        this.userRepository.findById(reviewUpdateDto.getUserId()),
        this.reviewRepository.findOneByReviewId(reviewUpdateDto.getReviewId()),
      ]);

      if (!event || !user || !review) {
        throw new NotExistException('not exist field');
      }

      return await this.reviewRepository.updateReview(reviewUpdateDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getReviews(
    reviewParamDto: ReviewListRequestParamDto,
    cursor: ReviewListRequestQueryDto,
  ): Promise<ReviewDto[] | []> {
    try {
      // TODO 리팩터링
      const reviews = await this.reviewRepository.find(reviewParamDto, cursor);
      const reviewsDto = reviews.map((review) => {
        const likeCount = review.reviewLikes.reduce((acc, like) => {
          if (like.isLike) {
            return acc + 1;
          }
          return acc;
        }, 0);

        return { ...review, likeCount };
      });
      return reviewsDto
        .map((review) => {
          let isLike = false;
          review.reviewLikes.forEach((like) => {
            if (like.isLike && like.userId === cursor.getUserId()) {
              isLike = true;
            }
          });
          return { ...review, isLike };
        })
        .map((review) => plainToInstance(ReviewDto, review));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserReviews(
    reviewParamDto: ReviewUserRequestParamDto,
    cursor: ReviewUserRequestQueryDto,
  ): Promise<ReviewUserDto[] | []> {
    try {
      const reviews = await this.reviewRepository.findUserReviews(
        reviewParamDto,
        cursor,
      );
      // TODO 리팩터링
      const reviewsDto = reviews.map((review) => {
        const likeCount = review.reviewLikes.reduce((acc, like) => {
          if (like.isLike) {
            return acc + 1;
          }

          return acc;
        }, 0);

        return { ...review, likeCount };
      });

      return reviewsDto
        .map((review) => {
          let isLike = false;
          review.reviewLikes.forEach((like) => {
            if (like.isLike && like.userId === reviewParamDto.getUserId()) {
              isLike = true;
            }
          });
          return { ...review, isLike };
        })
        .map((review) => plainToInstance(ReviewUserDto, review));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async likeReview(reviewLikeDto): Promise<number | null> {
    try {
      return await this.reviewRepository.updateLike(reviewLikeDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
