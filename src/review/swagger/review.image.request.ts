import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewImageRequest {
  @ApiProperty({ description: '리뷰 작성자' })
    userId: string;

  @ApiPropertyOptional({ description: '리뷰 이미지 아이디' })
    reviewImageId: string;

  @ApiPropertyOptional({ description: '업로드 하려는 이미지 url' })
    images: string[];
}
