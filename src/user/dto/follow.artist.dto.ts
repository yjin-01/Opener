import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FollowArtist {
  @Expose({ name: 'id' })
    id: string;

  @Expose({ name: 'artistName' })
    name: string;

  @Expose({ name: 'artistImage' })
    image: string;
}
