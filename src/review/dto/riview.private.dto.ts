import { Exclude, Expose, Type } from 'class-transformer';

class ReviewUser {
  @Expose()
    id: string;

  @Expose({ name: 'alias' })
    nickName: string;

  @Expose()
    profileImage: string;
}

@Exclude()
export class PrivateReviewDto {
  @Expose()
    id: string;

  @Expose({ name: 'sequence' })
    cursorId: number;

  @Expose()
    isPublic: boolean;

  @Expose()
    rating: boolean;

  @Expose()
    createdAt: Date;

  @Expose()
    likeCount: number;

  @Expose()
    isLike: boolean;

  @Expose()
  @Type(() => ReviewUser)
    user: ReviewUser;
}
