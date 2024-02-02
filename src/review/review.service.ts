import { Injectable, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReviewRepository } from './review.repository';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async createReview(reviewPostDto): Promise<any> {
    try {
      return await this.reviewRepository.create(reviewPostDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getReviews(reviewParamDto, cursor): Promise<ReviewDto[] | []> {
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
      return reviewsDto.map((review) => plainToInstance(ReviewDto, review));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
