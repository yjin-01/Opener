export interface ReviewRepository {
  create(reviewPostDto): Promise<null>;
}
