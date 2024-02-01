import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './interface/user.repository';
import { ExistException } from './exception/exist.exception';
import { UserToArtist } from './entity/user.artist.entity';
import { UserSignupDto } from './dto/user.signup.dto';

@Injectable()
export class UserRepositoryImple implements UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

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

        await transactioManager
          .getRepository(UserToArtist)
          .createQueryBuilder('ua')
          .insert()
          .into(UserToArtist)
          .values(user.extractArtists(identifiers[0].id))
          .execute();

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
