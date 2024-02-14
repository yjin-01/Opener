import { ApiProperty } from '@nestjs/swagger';

export class ReviewClaimRequest {
  @ApiProperty({ description: '신고자 아이디' })
    userId: string;

  @ApiProperty({ description: '신고 내용' })
    description: string;
}
