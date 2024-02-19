import { Expose } from 'class-transformer';

export class FollowArtistResponseDto {
  @Expose({ name: 'id' })
    result: string;
}
