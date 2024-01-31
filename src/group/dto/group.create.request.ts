import { IsUrl, IsString, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupCreateRequest {
  @ApiProperty({ description: '그룹명', default: 'test_group' })
  @IsString()
    groupName: string;

  @ApiProperty({ description: '그룹 데뷔일', default: '2016-01-01' })
  @IsDate()
    debutDate: Date;

  @ApiPropertyOptional({
    description: '등록할 그룹의 대표 이미지',
    default: 'http://image.co.kr',
  })
  @IsUrl()
    groupImage: string;
}
