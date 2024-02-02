import { Review } from './entity/review.entity';

export interface ReviewRepository {
  create(reviewPostDto): Promise<null>;
  find(eventId, cursor): Promise<Review[] | []>;
}
