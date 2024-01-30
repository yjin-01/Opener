import { IsUrl, IsString, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArtistCreateRequest {
  @ApiProperty({ description: '아티스트', default: 'test_artist' })
  @IsString()
    artistName: string;

  @ApiProperty({ description: '아티스트 생일', default: '2016-01-01' })
  @IsDate()
    birthday: Date;

  @ApiPropertyOptional({
    description: '등록할 아티스트의 대표 이미지',
    default: 'http://image.co.kr',
  })
  @IsUrl()
    artistImage: string;

  @ApiPropertyOptional({
    description: '등록할 아티스트의 group_id',
    default: '53bdc763-2036-4d',
  })
  @IsString()
    groupId: string;
}
