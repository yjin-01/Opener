import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from './interface/user.repository';
import { UserSignupDto } from './dto/user.signup.dto';
import { enctypt } from './utils/encrypt';
import { InvalidException } from './exception/invalid.exception';
import { UserNicknameResponse } from './dto/user.nickname.response';
import { UserUpdateProfileDto } from './dto/user.update.profile.dto';
import { UserUpdatePasswordDto } from './dto/user.update.password';
import { FollowDto } from './dto/follow.dto';
import { FollowArtist } from './dto/follow.artist.dto';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { FollowUpdateDto } from './dto/follow.update.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('UserRepository') private userRepositoryImple: UserRepository,
  ) {}

  async deleteUser(userId: string, tokenUserId: string): Promise<void> {
    try {
      if (userId !== tokenUserId) {
        throw new InvalidException('invalid user and token');
      }

      return await this.userRepositoryImple.delete(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(email: string): Promise<UserDto | null> {
    const user = this.userRepositoryImple.findByEmail(email);

    if (!user) {
      throw new NotExistException('not exist user');
    }

    return plainToInstance(UserDto, user);
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    const user = this.userRepositoryImple.findById(userId);

    if (!user) {
      throw new NotExistException('not exist user');
    }

    return plainToInstance(UserDto, user);
  }

  async getMyArtistList(userId: string): Promise<FollowArtist[] | null> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!user) {
        throw new NotExistException('not exist user');
      }

      const result = await this.userRepositoryImple.findFollow(userId);
      return result!.map((userArtist) => plainToInstance(FollowArtist, userArtist.artist));
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeFollowArtist(
    userId: string,
    followDto: FollowUpdateDto,
  ): Promise<void> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!user) {
        throw new NotExistException('not exist user');
      }

      await this.userRepositoryImple.changeFollow(userId, followDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async unfollowArtist(
    userId: string,
    followDto: FollowDto,
  ): Promise<number | null> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!user) {
        throw new NotExistException('not exist user');
      }

      return await this.userRepositoryImple.deleteFollow(userId, followDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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

  async createUser(user: UserSignupDto): Promise<User | null> {
    try {
      if (user.isOpener() && !user.isValidPassword()) {
        throw new InvalidException('invalid password');
      }

      if (user.isOpener() && user.isValidPassword()) {
        await user.encrypt(this.configService, enctypt);
      }

      return await this.userRepositoryImple.create(user);
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
