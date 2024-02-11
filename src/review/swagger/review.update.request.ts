import { ApiProperty } from '@nestjs/swagger';

export class ReviewUpdateRequest {
  @ApiProperty({ description: '리뷰를 작성한 유저 아이디', default: 'test' })
    userId: string;

  @ApiProperty({ description: '이 리뷰가 달린 이벤트 아이디', default: 'test' })
    eventId: string;

  @ApiProperty({
    description: '리뷰 공개 여부',
    default: true,
  })
    isPublic: boolean;

  @ApiProperty({
    description: '이벤트에 대한 평가',
    default: true,
  })
    rating: boolean;

  @ApiProperty({ description: '리뷰 내용', default: '한 번 더 갈 예정' })
    description: string;
}
