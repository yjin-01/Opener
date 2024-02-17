import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewUpdateRequest {
  @ApiProperty({
    description: '리뷰를 작성한 유저 아이디',
    default: 'cce311df-1c7e-49dd-8585-3a8217555eb1',
  })
    userId: string;

  @ApiProperty({
    description: '이 리뷰가 달린 이벤트 아이디',
    default: '0396d2c0-457d-49',
  })
    eventId: string;

  @ApiProperty({
    description: '리뷰 아이디',
    default: 'e6968dfc-ad25-43e5-8989-82b9db1afb09',
  })
    reviewId: string;

  @ApiPropertyOptional({
    description: '리뷰 공개 여부',
    default: true,
  })
    isPublic: boolean;

  @ApiPropertyOptional({
    description: '이벤트에 대한 평가',
    default: true,
  })
    rating: boolean;

  @ApiPropertyOptional({
    description: '리뷰 내용',
    default: '후기 수정됨??',
  })
    description: string;
}
