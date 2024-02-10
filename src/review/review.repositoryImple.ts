import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './review.repository';
import { ReviewImage } from './entity/review.imege.entity';
import { ReviewLike } from './entity/review.like.entity';

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async updateLike(reviewLikeDto: any): Promise<number | null> {
    try {
      const [user, review] = await Promise.all([
        this.entityManager.findOneBy(User, { id: reviewLikeDto.userId }),
        this.entityManager.findOneBy(Review, { id: reviewLikeDto.reviewId }),
      ]);

      if (!user) {
        throw new NotExistException('not exist user');
      }

      if (!review) {
        throw new NotExistException('not exist review');
      }

      const reviewLike = await this.entityManager
        .getRepository(ReviewLike)
        .findOneBy({
          reviewId: reviewLikeDto.reviewId,
          userId: reviewLikeDto.userId,
        });
      if (!reviewLike) {
        await this.entityManager
          .getRepository(ReviewLike)
          .createQueryBuilder()
          .insert()
          .into(ReviewLike)
          .values(reviewLikeDto)
          .execute();
      } else {
        await this.entityManager
          .getRepository(ReviewLike)
          .update(
            { userId: reviewLikeDto.userId, reviewId: reviewLikeDto.reviewId },
            { isLike: reviewLikeDto.isLike },
          );
      }
      return await this.entityManager
        .getRepository(ReviewLike)
        .countBy({ isLike: true, reviewId: reviewLikeDto.reviewId });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async find(reviewParamDto, cursor): Promise<Review[] | []> {
    try {
      return await this.entityManager
        .getRepository(Review)
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.user', 'u')
        .leftJoinAndSelect('r.reviewImages', 'ri')
        .leftJoinAndSelect('r.reviewLikes', 'rl')
        .select([
          'r.id',
          'r.sequence',
          'r.isPublic',
          'r.rating',
          'r.description',
          'r.createdAt',
        ])
        .addSelect(['u.id', 'u.alias', 'u.profileImage'])
        .addSelect(['ri.id', 'ri.url'])
        .addSelect(['rl.id', 'rl.isLike'])
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

  async findUserReviews(reviewParamDto, cursor): Promise<Review[] | []> {
    try {
      return await this.entityManager
        .getRepository(Review)
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.reviewImages', 'ri')
        .leftJoinAndSelect('r.reviewLikes', 'rl')
        .leftJoinAndSelect('r.event', 'e')
        .select([
          'r.id',
          'r.sequence',
          'r.isPublic',
          'r.rating',
          'r.description',
          'r.createdAt',
        ])
        .addSelect(['ri.id', 'ri.url', 'ri.createdAt'])
        .addSelect(['rl.userId', 'rl.isLike'])
        .addSelect([
          'e.id',
          'e.placeName',
          'e.eventType',
          'e.address',
          'e.startDate',
          'e.endDate',
        ])
        .where(`r.userId = '${reviewParamDto.getUserId()}'`)
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
