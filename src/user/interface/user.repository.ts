import { User } from '../entity/user.entity';

export interface UserRepository {
  create(user): Promise<User | null>;
  findBy(user): Promise<User | null>;
}
