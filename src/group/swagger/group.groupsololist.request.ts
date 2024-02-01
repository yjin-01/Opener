import { IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GroupSoloListRequest {
  @ApiPropertyOptional({
    description: '검색할 그룹명 또는 솔로명',
    default: '선미',
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
