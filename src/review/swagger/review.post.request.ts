import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewPostRequest {
  @ApiProperty({ description: '리뷰를 작성한 유저 아이디', default: 'test' })
    userId: string;

  @ApiProperty({ description: '이 리뷰가 달린 이벤트 아이디', default: 'test' })
    eventId: string;

  @ApiPropertyOptional({
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

  @ApiProperty({
    description: '리뷰에 첨부된 이미지 파일 url',
    default: "['http::image1.co.kr', 'http::image2.co.kr']",
  })
    reviewImages: string[] | [];

  @ApiPropertyOptional({ description: '리뷰 등록 약관 동의', default: true })
    isAgree: boolean;
}
