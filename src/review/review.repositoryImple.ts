import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './review.repository';
import { ReviewImage } from './entity/review.imege.entity';

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(reviewPostDto): Promise<any> {
    try {
      return await this.entityManager.transaction(
        async (transactionManager) => {
          const { identifiers } = await transactionManager
            .getRepository(Review)
            .createQueryBuilder()
            .insert()
            .into(Review)
            .values(reviewPostDto)
            .execute();

          await transactionManager
            .getRepository(ReviewImage)
            .createQueryBuilder()
            .insert()
            .into(ReviewImage)
            .values(reviewPostDto.toReviewImages(identifiers[0].id))
            .execute();
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
