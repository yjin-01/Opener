import { ApiProperty } from '@nestjs/swagger';

class ReviewUser {
  @ApiProperty()
    id: string;

  @ApiProperty()
    nickName: string;

  @ApiProperty()
    profileImage: string;
}

class ReviewImage {
  @ApiProperty()
    url: string;

  @ApiProperty()
    createdAt: Date;
}

export class ReviewsResponse {
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

  @ApiProperty({ type: ReviewUser })
    user: ReviewUser;

  @ApiProperty({ type: ReviewImage, isArray: true })
    reviewImages: ReviewImage[];
}
