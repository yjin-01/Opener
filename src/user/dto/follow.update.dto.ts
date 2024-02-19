import { plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';

class FollowArtist {
  userId: string;

  artistId: string;
}

export class FollowUpdateDto {
  @IsUUID('all', { each: true })
    deleteArtistIds: string[];

  @IsUUID('all', { each: true })
    addArtistIds: string[];

  toFollowArtist(userId: string): FollowArtist[] {
    return this.addArtistIds.map((artistId) => plainToInstance(FollowArtist, { userId, artistId }));
  }
}
