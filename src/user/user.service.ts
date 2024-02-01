import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from 'src/authentication/dto/token.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UserRepository } from './interface/user.repository';
import { UserSignupDto } from './dto/user.signup.dto';
import { enctypt } from './utils/encrypt';
import { InvalidException } from './exception/invalid.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('AuthenticationService')
    private readonly authenticationService: AuthenticationService,
    @Inject('UserRepository') private userRepositoryImple: UserRepository,
  ) {}

  async createUser(user: UserSignupDto): Promise<TokenDto | null> {
    try {
      if (!user.isMatchedPassword()) {
        throw new InvalidException('not matched password');
      }
      await user.encrypt(this.configService, enctypt);
      const newUser = await this.userRepositoryImple.create(user);
      return await this.authenticationService.generateTokenPair(newUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
