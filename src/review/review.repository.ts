import { ReviewClaimDto } from './dto/review.claim.dto';
import { ReviewImageDto } from './dto/review.image.dto';
import { ReviewUpdateDto } from './dto/review.update.dto';
import { Review } from './entity/review.entity';

export interface ReviewRepository {
  create(reviewPostDto): Promise<null>;
  find(eventId, cursor): Promise<Review[] | []>;
  findUserReviews(userId, cursor): Promise<Review[] | []>;
  updateLike(reviewLikeDto): Promise<number | null>;
  updateReview(reviewUpdateDto: ReviewUpdateDto): Promise<number | undefined>;
  findOneByReviewId(reviewId: string): Promise<Review | null>;
  createImages(
    reviewId: string,
    reviewImageDto: ReviewImageDto,
  ): Promise<string | null>;
  deleteImages(
    reviewId: string,
    reviewImageDto: ReviewImageDto,
  ): Promise<number | null>;
  findWithImages(reviewId: string): Promise<Review | null>;
  createClaim(
    reviewClaimDto: ReviewClaimDto,
    reviewId: string,
  ): Promise<string>;
}
