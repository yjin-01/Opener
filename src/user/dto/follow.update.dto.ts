import { plainToInstance } from 'class-transformer';
import { IsUUID, ValidateIf } from 'class-validator';

export class FollowArtist {
  userId: string;

  artistId: string;
}

export class FollowGroup {
  userId: string;

  groupId: string;
}

export class FollowUpdateDto {
  @IsUUID('all', { each: true })
  @ValidateIf((object, value) => value.length > 0)
    deleteArtistIds: string[];

  @IsUUID('all', { each: true })
  @ValidateIf((object, value) => value.length > 0)
    addArtistIds: string[];

  @IsUUID('all', { each: true })
  @ValidateIf((object, value) => value.length > 0)
    deleteGroupIds: string[];

  @IsUUID('all', { each: true })
  @ValidateIf((object, value) => value.length > 0)
    addGroupIds: string[];

  toFollowArtist(userId: string): FollowArtist[] {
    return this.addArtistIds.map((artistId) => plainToInstance(FollowArtist, { userId, artistId }));
  }

  toFollowGroup(userId: string): FollowGroup[] {
    return this.addGroupIds.map((groupId) => plainToInstance(FollowGroup, { userId, groupId }));
  }
}
