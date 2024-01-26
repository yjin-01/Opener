import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './interface/user.repository';
import { UserSignupDto } from './dto/user.signup';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private userRepositoryImple: UserRepository,
  ) {}

  async createUser(user: UserSignupDto): Promise<User | null> {
    try {
      const result = await this.userRepositoryImple.create(user);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
