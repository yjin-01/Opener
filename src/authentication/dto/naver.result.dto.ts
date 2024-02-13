import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class NaverResultDto {
  id: string;

  @Expose({ name: 'nickname' })
    nickName: string;

  @Expose({ name: 'profile_image' })
    profileImage: string;

  @Expose()
    email: string;

  @Transform(() => 'naver', { toClassOnly: true })
  @Expose()
    signupMethod: string;
}
