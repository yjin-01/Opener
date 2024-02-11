import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from 'src/authentication/dto/token.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { UserRepository } from './interface/user.repository';
import { UserSignupDto } from './dto/user.signup.dto';
import { enctypt } from './utils/encrypt';
import { InvalidException } from './exception/invalid.exception';
import { UserNicknameResponse } from './dto/user.nickname.response';
import { UserUpdateProfileDto } from './dto/user.update.profile.dto';
import { UserUpdatePasswordDto } from './dto/user.update.password';
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('AuthenticationService')
    private readonly authenticationService: AuthenticationService,
    @Inject('UserRepository') private userRepositoryImple: UserRepository,
  ) {}

  async addArtist(
    userId: string,
    followDto: FollowDto,
  ): Promise<string | null> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!user) {
        throw new NotExistException('not exist user');
      }

      return await this.userRepositoryImple.createFollow(userId, followDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createUser(user: UserSignupDto): Promise<TokenDto | null> {
    try {
      if (user.isOpener() && !user.isValidPassword()) {
        throw new InvalidException('invalid password');
      }

      if (user.isOpener() && user.isValidPassword()) {
        await user.encrypt(this.configService, enctypt);
      }

      const newUser = await this.userRepositoryImple.create(user);

      return await this.authenticationService.generateTokenPair(newUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async isDuplicatedNickname(search): Promise<UserNicknameResponse | null> {
    try {
      const result = await this.userRepositoryImple.findByNickname(search);
      if (!result) {
        return new UserNicknameResponse(false);
      }
      return new UserNicknameResponse(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProfile(
    userDto: UserUpdateProfileDto,
    userId: string,
  ): Promise<number | undefined> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!user) {
        throw new NotExistException('user not exist');
      }

      return await this.userRepositoryImple.updateById(userDto, userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updatePassword(
    userDto: UserUpdatePasswordDto,
    userId: string,
  ): Promise<number | undefined> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!userDto.isValidPassword()) {
        throw new InvalidException('invalid password');
      }

      if (!user) {
        throw new NotExistException('user not exist');
      }

      await userDto.encrypt(this.configService, enctypt);

      return await this.userRepositoryImple.updateById(
        userDto.excludePasswordCheck(),
        userId,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
