import { IsUUID } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserToArtist } from '../entity/user.artist.entity';

export class FollowDto {
  @IsUUID('all', { each: true })
    artistIds: string[];

  toEntities(userId: string): UserToArtist[] {
    return this.artistIds.map((artistId) => plainToInstance(UserToArtist, { userId, artistId }));
  }

  extract(): string[] {
    return this.artistIds.slice();
  }
}
