import { plainToInstance } from 'class-transformer';
import { ReviewClaim } from '../entity/review.claim.entity';

export class ReviewClaimDto {
  userId: string;

  description: string;

  getUserId(): string {
    return this.userId;
  }

  toEntity(reviewId: string): ReviewClaim {
    return plainToInstance(ReviewClaim, { ...this, reviewId });
  }
}
