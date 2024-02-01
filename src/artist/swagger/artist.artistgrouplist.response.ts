import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArtistGroupListResponse {
  @ApiProperty({
    description: '그룹 또는 아티스트 ID',
    default: '5c6141ab-cf30-48',
  })
  @IsString()
    id: string;

  @ApiPropertyOptional({
    description: '그룹 또는 아티스트 이름',
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
    default: 'member',
  })
  @IsString()
    type: string;
}
