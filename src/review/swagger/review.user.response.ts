import { ApiProperty } from '@nestjs/swagger';

class UserEvent {
  @ApiProperty()
    id: string;

  @ApiProperty()
    placeName: string;

  @ApiProperty()
    eventType: string;

  @ApiProperty()
    address: string;

  @ApiProperty()
    startDate: Date;

  @ApiProperty()
    endDate: Date;
}

class ReviewImage {
  @ApiProperty()
    url: string;

  @ApiProperty()
    createdAt: Date;
}

class ReviewArtist {
  @ApiProperty()
    artistId: string;

  @ApiProperty()
    artistName: string;

  @ApiProperty()
    groupId: string;

  @ApiProperty()
    groupName: string;
}

export class ReviewUserResponse {
  @ApiProperty()
    id: string;

  @ApiProperty()
    cursorId: number;

  @ApiProperty()
    isPublic: boolean;

  @ApiProperty()
    isLike: boolean;

  @ApiProperty()
    rating: boolean;

  @ApiProperty()
    likeCount: number;

  @ApiProperty()
    description: string;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    event: UserEvent;

  @ApiProperty({ type: ReviewImage, isArray: true })
    reviewImages: ReviewImage[];

  @ApiProperty({ type: ReviewArtist, isArray: true })
    reviewArtists: ReviewArtist[];
}
