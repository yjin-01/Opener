import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventUpdateApprovalRequestDto {
  @ApiPropertyOptional({
    description: '수정 신청 id',
    example: '1fab0958-dafc-48',
  })
  @IsString()
    eventUpdateApplicationId: string;

  @ApiProperty({
    description: '승인, 거절',
    examples: {
      example1: {
        description: '승인',
        value: true,
      },
      example2: {
        description: '거절',
        value: false,
      },
    },
  })
  @IsBoolean()
    isApproved: boolean;
}
