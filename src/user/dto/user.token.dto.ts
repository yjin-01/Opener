import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserTokenDto {
  @Expose()
    email: string;

  @Expose()
    signupMethod: string;
}
