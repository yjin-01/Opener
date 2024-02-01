import { Injectable, Inject } from '@nestjs/common';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) {}

  private hello = 'Hello World!!!!!!!';

  async createReview(reviewPostDto): Promise<any> {
    try {
      return await this.reviewRepository.create(reviewPostDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getHello(): string {
    return this.hello;
  }
}
