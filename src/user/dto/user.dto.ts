import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose({ name: 'id' })
    userId: string;

  @Expose({ name: 'alias' })
    nickName: string;

  @Expose()
    profileImage: string;

  @Expose()
    email: string;

  @Expose()
    signupMethod: string;
}
