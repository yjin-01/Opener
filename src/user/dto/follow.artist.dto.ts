import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FollowArtist {
  @Expose()
    id: string;

  @Expose()
    name: string;

  @Expose()
    type: string;

  @Expose()
    image: string;
}
