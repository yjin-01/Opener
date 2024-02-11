import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewImageRequest {
  @ApiProperty({
    description: '리뷰 작성자',
    default: '56059f44-0a1d-4252-86eb-53d804773e15',
  })
    userId: string;

  @ApiPropertyOptional({
    description: '리뷰 이미지 아이디',
    default: [
      '668e22f1-da99-488a-b7be-39783ebd3876',
      '022aff57-7ca0-4920-965a-8962d9e801a1',
    ],
  })
    reviewImages: string[];

  @ApiPropertyOptional({
    description: '업로드 하려는 이미지 url',
    default: ['https://image1.co.kr', 'https://image2.co.kr'],
  })
    images: string[];
}
