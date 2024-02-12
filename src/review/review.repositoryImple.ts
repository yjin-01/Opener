import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './review.repository';
import { ReviewImage } from './entity/review.imege.entity';
import { ReviewLike } from './entity/review.like.entity';
import { ReviewUpdateDto } from './dto/review.update.dto';
import { ReviewImageDto } from './dto/review.image.dto';

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findWithImages(reviewId: string): Promise<Review | null> {
    try {
      return await this.entityManager
        .getRepository(Review)
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.reviewImages', 'ri')
        .select(['r.id', 'r.isPublic', 'r.rating', 'r.description'])
        .addSelect(['ri.id', 'ri.url'])
        .where(`r.id = '${reviewId}'`)
        .andWhere(`ri.reviewId = '${reviewId}'`)
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteImages(
    reviewId: string,
    reviewImageDto: ReviewImageDto,
  ): Promise<number | null> {
    try {
      const { affected } = await this.entityManager
        .getRepository(ReviewImage)
        .createQueryBuilder()
        .delete()
        .from(ReviewImage)
        .whereInIds(reviewImageDto.getImages(reviewId))
        .execute();
      return affected || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createImages(
    reviewId: string,
    reviewImageDto: ReviewImageDto,
  ): Promise<string | null> {
    try {
      const { identifiers } = await this.entityManager
        .getRepository(ReviewImage)
        .createQueryBuilder()
        .insert()
        .into(ReviewImage)
        .values(reviewImageDto.toEntities(reviewId))
        .execute();
      return identifiers[0].id;
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }

  async findOneByReviewId(reviewId: string): Promise<Review | null> {
    try {
      return await this.entityManager
        .getRepository(Review)
        .findOneBy({ id: reviewId });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateReview(
    reviewUpdateDto: ReviewUpdateDto,
  ): Promise<number | undefined> {
    try {
      const { affected } = await this.entityManager
        .getRepository(Review)
        .update(
          reviewUpdateDto.getUpdateTarget(),
          reviewUpdateDto.getUpdateValue(),
        );
      return affected;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
        .addSelect(['rl.id', 'rl.userId', 'rl.isLike'])
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

          const review = await transactionManager
            .getRepository(Review)
            .findOneBy(identifiers[0]);

          await transactionManager
            .getRepository(ReviewImage)
            .createQueryBuilder()
            .insert()
            .into(ReviewImage)
            .values(reviewPostDto.toReviewImages(review?.id))
            .execute();
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
