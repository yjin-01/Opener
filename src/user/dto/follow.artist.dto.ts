import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FollowArtist {
  @Expose({ name: 'id' })
    artistId: string;

  @Expose()
    artistName: string;

  @Expose()
    artistImage: string;
}
