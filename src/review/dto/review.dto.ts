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
    user: ReviewUser;

  @Expose()
    reviewImages: ReviewImage[];
}
