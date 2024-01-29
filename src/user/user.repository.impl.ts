import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './interface/user.repository';
import { ExistException } from './exception/exist.exception';

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

  async create(user): Promise<User | null> {
    try {
      const alreadyExistUser = await this.entityManager
        .getRepository(User)
        .findOneBy({ email: user.email });

      if (alreadyExistUser) {
        throw new ExistException('exist user');
      }

      await this.entityManager
        .getRepository(User)
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([user])
        .execute();

      const newUser = await this.entityManager
        .getRepository(User)
        .findOneBy({ email: user.email });

      return newUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
