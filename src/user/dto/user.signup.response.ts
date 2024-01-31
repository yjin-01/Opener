import { Exclude, Expose } from 'class-transformer';
import { UserToArtist } from '../entity/user.artist.entity';

@Exclude()
export class UserSignupResponse {
  @Expose()
    userId: string;

  @Expose()
    username: string;

  @Expose()
    email: string;

  @Expose({ name: 'alias' })
    nickName: string;

  @Expose({ name: 'userArtists' })
    myArtists: UserToArtist[];
}
