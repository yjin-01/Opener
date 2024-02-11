import { IsArray, IsUrl } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReviewImage } from '../entity/review.imege.entity';

export class ReviewImageDto {
  userId: string;

  reviewImageId: string;

  @IsArray()
  @IsUrl({}, { each: true })
    images: string[];

  toEntities(reviewId: string): ReviewImage[] {
    return this.images.map((url) => plainToInstance(ReviewImage, { userId: this.userId, url, reviewId }));
  }

  getUserId(): string {
    return this.userId;
  }
}
