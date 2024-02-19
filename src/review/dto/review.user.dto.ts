import { Exclude, Expose, Type } from 'class-transformer';

type ReviewUser = {
  id: string;
  nickName: string;
  profileImage: string;
};

type ReviewImage = {
  url: string;
  createdAt: Date;
};

class Event {
  id: string;

  placeName: string;

  eventType: string;

  startDate: Date;

  endDate: Date;

  @Exclude()
    targetArtists: any;
}

class ReviewArtist {
  artistId: string;

  artistName: string;

  groupId: string;

  groupName: string;
}

@Exclude()
export class ReviewUserDto {
  @Expose()
    id: string;

  @Expose({ name: 'sequence' })
    cursorId: number;

  @Expose()
    isPublic: boolean;

  @Expose()
    isLike: boolean;

  @Expose()
    rating: boolean;

  @Expose()
    description: string;

  @Expose()
    createdAt: Date;

  @Expose()
    likeCount: number;

  @Expose()
  @Type(() => Event)
    event: Event;

  @Expose()
    user: ReviewUser;

  @Expose()
    reviewImages: ReviewImage[];

  @Expose()
    reviewArtists: ReviewArtist[];
}
