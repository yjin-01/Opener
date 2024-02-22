import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './interface/user.repository';
import { ExistException } from './exception/exist.exception';
import { UserToArtist } from './entity/user.artist.entity';
import { UserSignupDto } from './dto/user.signup.dto';
import { UserUpdateProfileDto } from './dto/user.update.profile.dto';
import { FollowDto } from './dto/follow.dto';
import { FollowUpdateDto } from './dto/follow.update.dto';

@Injectable()
export class UserRepositoryImple implements UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async changeFollow(
    userId: string,
    changeFollowDto: FollowUpdateDto,
  ): Promise<void> {
    try {
      await this.entityManager.transaction(async (transactionManager) => {
        if (changeFollowDto.deleteArtistIds.length > 0) {
          transactionManager
            .getRepository(UserToArtist)
            .createQueryBuilder()
            .delete()
            .from(UserToArtist)
            .where('user_id = :userId', { userId })
            .andWhere('artist_id IN(:...ids)', {
              ids: changeFollowDto.deleteArtistIds,
            })
            .execute();
        }

        if (changeFollowDto.deleteGroupIds.length > 0) {
          transactionManager
            .getRepository(UserToArtist)
            .createQueryBuilder()
            .delete()
            .from(UserToArtist)
            .where('user_id = :userId', { userId })
            .andWhere('group_id IN(:...ids)', {
              ids: changeFollowDto.deleteGroupIds,
            })
            .execute();
        }

        if (changeFollowDto.addArtistIds.length > 0) {
          transactionManager
            .getRepository(UserToArtist)
            .createQueryBuilder()
            .insert()
            .into(UserToArtist)
            .values(changeFollowDto.toFollowArtist(userId))
            .execute();
        }

        if (changeFollowDto.addGroupIds.length > 0) {
          transactionManager
            .getRepository(UserToArtist)
            .createQueryBuilder()
            .insert()
            .into(UserToArtist)
            .values(changeFollowDto.toFollowGroup(userId))
            .execute();
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      return await this.entityManager.transaction(async (transactioManager) => {
        await Promise.all([
          transactioManager.getRepository(User).delete({ id: userId }),
          transactioManager.getRepository(UserToArtist).delete({ userId }),
        ]);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.entityManager.getRepository(User).findOneBy({ email });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findFollow(userId: string): Promise<UserToArtist[] | []> {
    try {
      return await this.entityManager
        .getRepository(UserToArtist)
        .createQueryBuilder('ua')
        .leftJoinAndSelect('ua.artist', 'a')
        .select(['ua.id'])
        .addSelect(['a.id', 'a.artistName', 'a.artistImage'])
        .where('ua.userId = :userId', { userId })
        .getMany();
    } catch (error) {
      throw Error(error);
    }
  }

  async deleteFollow(
    userId: string,
    followDto: FollowDto,
  ): Promise<number | null> {
    try {
      const { affected } = await this.entityManager
        .getRepository(UserToArtist)
        .createQueryBuilder()
        .delete()
        .from(UserToArtist)
        .where({ userId })
        .andWhere('artist_id IN (:...ids)', { ids: followDto.extract() })
        .execute();
      return affected || null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createFollow(
    userId: string,
    followDto: FollowDto,
  ): Promise<string | null> {
    try {
      const { identifiers } = await this.entityManager
        .getRepository(UserToArtist)
        .createQueryBuilder()
        .insert()
        .into(UserToArtist)
        .values(followDto.toEntities(userId))
        .execute();
      return identifiers[0].id;
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }

  async findById(userId: any): Promise<User | null> {
    try {
      return await this.entityManager
        .getRepository(User)
        .findOneBy({ id: userId });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateById(
    userDto: UserUpdateProfileDto,
    userId: string,
  ): Promise<number | undefined> {
    try {
      const { affected } = await this.entityManager
        .getRepository(User)
        .update({ id: userId }, userDto);
      return affected;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findByNickname(nickname: any): Promise<User | null> {
    try {
      return await this.entityManager
        .getRepository(User)
        .findOneBy({ alias: nickname });
    } catch (err) {
      console.error(err);
      throw new Error('Method not implemented.');
    }
  }

  async findBy(user: any): Promise<User | null> {
    try {
      return await this.entityManager
        .getRepository(User)
        .findOneBy({ email: user.email });
    } catch (err) {
      console.error(err);
      throw new Error('Method not implemented.');
    }
  }

  async create(user: UserSignupDto): Promise<User | null> {
    try {
      return await this.entityManager.transaction(async (transactioManager) => {
        const alreadyExistUser = await transactioManager
          .getRepository(User)
          .findOneBy({ email: user.email });

        if (alreadyExistUser) {
          throw new ExistException('exist user');
        }

        const { identifiers } = await transactioManager
          .getRepository(User)
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([user])
          .execute();

        if (user.hasArtists()) {
          await transactioManager
            .getRepository(UserToArtist)
            .createQueryBuilder('ua')
            .insert()
            .into(UserToArtist)
            .values(user.extractArtists(identifiers[0].id))
            .execute();
        }

        return transactioManager
          .getRepository(User)
          .findOneBy({ id: identifiers[0].id });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
