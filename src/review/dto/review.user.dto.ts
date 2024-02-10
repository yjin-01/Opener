import { Exclude, Expose } from 'class-transformer';

type ReviewUser = {
  id: string;
  nickName: string;
  profileImage: string;
};

type ReviewImage = {
  url: string;
  createdAt: Date;
};

type Event = {
  id: string;
  placeName: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
};

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
    event: Event;

  @Expose()
    user: ReviewUser;

  @Expose()
    reviewImages: ReviewImage[];
}
