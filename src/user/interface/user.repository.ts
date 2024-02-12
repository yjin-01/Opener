import { FollowDto } from '../dto/follow.dto';
import { UserToArtist } from '../entity/user.artist.entity';
import { User } from '../entity/user.entity';

export interface UserRepository {
  create(user): Promise<User | null>;
  findBy(user): Promise<User | null>;
  findById(userId): Promise<User | null>;
  findByNickname(nickname): Promise<User | null>;
  updateById(userDto, userId): Promise<number | undefined>;
  createFollow(userId: string, followDto: FollowDto): Promise<string | null>;
  deleteFollow(userId: string, followDto: FollowDto): Promise<number | null>;
  findFollow(userId: string): Promise<UserToArtist[] | null>;
}
