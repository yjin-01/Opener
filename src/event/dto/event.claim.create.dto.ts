import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EventClaimDto {
  @ApiProperty({ description: '리뷰Id' })
  @IsString()
    eventId: string;

  @ApiProperty({ description: '유저Id' })
  @IsString()
    userId: string;

  @ApiProperty({ description: '신고 사유' })
  @IsString()
    description: string;
}
