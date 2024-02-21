import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FollowArtist {
  @Expose({ name: 'id' })
    id: string;

  @Expose({ name: 'artistName' })
<<<<<<< HEAD
    name: string;
=======
    nickName: string;
>>>>>>> e2e910d (Feat/remove artst prefix (#283) (#284))

  @Expose({ name: 'artistImage' })
    image: string;
}
