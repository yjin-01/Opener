import { Exclude, Expose, Type } from 'class-transformer';

class ReviewUser {
  @Expose()
    id: string;

  @Expose({ name: 'alias' })
    nickName: string;

  @Expose()
    profileImage: string;
}

type ReviewImage = {
  url: string;
  createdAt: Date;
};

@Exclude()
export class ReviewDto {
  @Expose()
    id: string;

  @Expose({ name: 'sequence' })
    cursorId: number;

  @Expose()
    isPublic: boolean;

  @Expose()
    rating: boolean;

  @Expose()
    description: string;

  @Expose()
    createdAt: Date;

  @Expose()
    likeCount: number;

  @Expose()
  @Type(() => ReviewUser)
    user: ReviewUser;

  @Expose()
    reviewImages: ReviewImage[];
}
