import { ApiProperty } from '@nestjs/swagger';

export class ReviewLike {
  @ApiProperty({
    name: '리뷰 아이디',
    default: '4b1a0f8d-658e-4342-a3b7-01e81d79fcf8',
  })
    reviewId: string;

  @ApiProperty({
    name: '유저 아이디',
    default: '6fc13c28-26f5-4ec0-ad41-b8548aeaa9c8',
  })
    userId: string;

  @ApiProperty({ name: '좋아요', default: 'true or false' })
    isLike: boolean;
}