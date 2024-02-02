import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './review.repository';
import { ReviewImage } from './entity/review.imege.entity';

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async find(reviewParamDto, cursor): Promise<Review[] | []> {
    try {
      return await this.entityManager
        .getRepository(Review)
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.user', 'user')
        .leftJoinAndSelect('r.reviewImages', 'reviewImages')
        .leftJoinAndSelect('r.reviewLikes', 'reviewLikes')
        .select([
          'r.id',
          'r.sequence',
          'r.isPublic',
          'r.rating',
          'r.description',
          'r.createdAt',
        ])
        .addSelect(['user.id', 'user.alias', 'user.profileImage'])
        .addSelect(['reviewImages.url', 'reviewImages.createdAt'])
        .addSelect(['reviewLikes.isLike'])
        .where(`r.eventId = '${reviewParamDto.getEventId()}'`)
        .andWhere('r.isPublic = true')
        .andWhere(`r.sequence < ${cursor.getCursorId()}`)
        .orderBy('r.sequence', 'DESC')
        .take(cursor.getSize())
        .getMany();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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
