import { User } from '../entity/user.entity';

export interface UserRepository {
  create(user): Promise<User | null>;
  findBy(user): Promise<User | null>;
  findById(userId): Promise<User | null>;
  findByNickname(nickname): Promise<User | null>;
  updateById(userDto, userId): Promise<number | undefined>;
}
