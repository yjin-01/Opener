import { ApiProperty } from '@nestjs/swagger';

export class ReviewClaimRequest {
  @ApiProperty({
    description: '신고자 아이디',
    default: 'cce311df-1c7e-49dd-8585-3a8217555eb1',
  })
    userId: string;

  @ApiProperty({ description: '신고 내용', default: '너무 어그로가 심함' })
    description: string;
}
