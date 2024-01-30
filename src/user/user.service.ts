import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './interface/user.repository';
import { UserSignupDto } from './dto/user.signup.dto';
import { User } from './entity/user.entity';
import { enctypt } from './utils/encrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('UserRepository') private userRepositoryImple: UserRepository,
  ) {}

  async createUser(user: UserSignupDto): Promise<User | null> {
    try {
      await user.encrypt(this.configService, enctypt);
      return await this.userRepositoryImple.create(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
