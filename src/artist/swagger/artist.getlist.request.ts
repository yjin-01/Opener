import { IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetArtistListRequest {
  @ApiPropertyOptional({
    description: '검색 카테고리 정보(group 또는 artist)',
    default: 'artist',
  })
  @IsString()
    category: string;

  @ApiPropertyOptional({
    description: '검색할 그룹명 또는 아티스트이름',
    default: '정우',
  })
  @IsString()
    keyword: string;

  @ApiPropertyOptional({
    description: '페이지',
    default: 1,
  })
  @IsInt()
    page: number;

  @ApiPropertyOptional({
    description: '데이터 개수',
    default: 12,
  })
  @IsInt()
    size: number;
}
