import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { plainToInstance } from 'class-transformer';
import { EntityManager } from 'typeorm';
import { Artist } from 'src/artist/entity/artist.entity';
import { Group } from 'src/group/entity/group.entity';
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
import { FollowArtistResponseDto } from './dto/follow.artist.response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('UserRepository') private userRepositoryImple: UserRepository,
    private entityManager: EntityManager,
  ) {}

  private readonly logger = new Logger('UserController');

  async deleteUser(userId: string, tokenUserId: string): Promise<void> {
    try {
      this.logger.debug(`${userId}, ${tokenUserId}`);
      if (userId !== tokenUserId) {
        this.logger.debug('invalid user and token');
        throw new InvalidException('invalid user and token');
      }

      return await this.userRepositoryImple.delete(userId);
    } catch (error) {
      this.logger.debug(error);
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
      return result!
        .map((following) => {
          if (following.artist) {
            return {
              id: following.artist.id,
              name: following.artist.artistName,
              type: 'member',
              image: following.artist.artistImage,
            };
          }
          return {
            id: following.group.id,
            name: following.group.groupName,
            type: 'group',
            image: following.group.groupImage,
          };
        })
        .map((userArtist) => plainToInstance(FollowArtist, userArtist));
    } catch (error) {
      console.error(error);
      throw error;
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
  ): Promise<FollowArtistResponseDto | null> {
    try {
      const user = await this.userRepositoryImple.findById(userId);

      if (!user) {
        throw new NotExistException('not exist user');
      }

      const id = await this.userRepositoryImple.createFollow(userId, followDto);
      return plainToInstance(FollowArtistResponseDto, { id });
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

      const artistIds = await this.entityManager
        .getRepository(Artist)
        .createQueryBuilder('a')
        .select(['a.id AS artistId'])
        .where('id IN(:...ids)', { ids: user.myArtists })
        .execute();

      const groupIds = await this.entityManager
        .getRepository(Group)
        .createQueryBuilder('g')
        .select(['g.id AS groupId'])
        .where('id IN(:...ids)', { ids: user.myArtists })
        .execute();

      console.log(artistIds.map, groupIds);
      return await this.userRepositoryImple.createWithIds(
        user,
        artistIds,
        groupIds,
      );
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
