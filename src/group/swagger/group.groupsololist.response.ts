import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupSoloListResponse {
  @ApiProperty({
    description: '그룹 또는 솔로 ID',
    default: '5c6141ab-cf30-48',
  })
  @IsString()
    id: string;

  @ApiPropertyOptional({
    description: '그룹 또는 솔로 이름',
    default: 1,
  })
  @IsString()
    name: string;

  @ApiPropertyOptional({
    description: '이미지URL',
    default: 'http://~~',
  })
  @IsString()
    image: string;

  @ApiProperty({
    description: '타입(group/solo/member)',
    default: 'solo',
  })
  @IsString()
    type: string;
}
