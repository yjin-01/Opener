import { Review } from './entity/review.entity';

export interface ReviewRepository {
  create(reviewPostDto): Promise<null>;
  find(eventId, cursor): Promise<Review[] | []>;
  findUserReviews(userId, cursor): Promise<Review[] | []>;
  updateLike(reviewLikeDto): Promise<number | null>;
}
