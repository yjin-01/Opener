import {
  IsArray, IsOptional, IsUUID, IsUrl,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReviewImage } from '../entity/review.imege.entity';

type ReviewImageValue = {
  id: string;
  userId: string;
  reviewId: string;
};

export class ReviewImageDto {
  userId: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
    images: string[];

  @IsOptional()
  @IsUUID('all', { each: true })
    reviewImages: string[];

  toEntities(reviewId: string): ReviewImage[] {
    return this.images.map((url) => plainToInstance(ReviewImage, { userId: this.userId, url, reviewId }));
  }

  getUserId(): string {
    return this.userId;
  }

  getImages(reviewId: string): ReviewImageValue[] {
    return this.reviewImages.map((id) => ({
      id,
      userId: this.userId,
      reviewId,
    }));
  }
}
