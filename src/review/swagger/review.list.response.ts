import { ApiProperty } from '@nestjs/swagger';

type ReviewUser = {
  id: string;
  nickName: string;
  profileImage: string;
};

type ReviewImage = {
  url: string;
  createdAt: Date;
};

export class ReviewListResponse {
  @ApiProperty()
    id: string;

  @ApiProperty()
    cursorId: number;

  @ApiProperty()
    isPublic: boolean;

  @ApiProperty()
    rating: boolean;

  @ApiProperty()
    description: string;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    likeCount: number;

  @ApiProperty()
    user: ReviewUser;

  @ApiProperty()
    reviewImages: ReviewImage[];
}
