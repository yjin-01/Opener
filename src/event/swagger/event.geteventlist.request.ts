import { ApiPropertyOptional } from '@nestjs/swagger';

export class EventListRequest {
  @ApiPropertyOptional({
    description: '조회할 그룹명 또는 아티스트이름',
    default: 'test',
  })
    keyword: string;

  @ApiPropertyOptional({
    description: '조회할 시/도',
    default: '서울',
  })
    sido: string;

  @ApiPropertyOptional({
    description: '조회할 시/군/구',
    default: '영등포구',
  })
    gungu: string;

  @ApiPropertyOptional({
    description: '조회할 시작일',
    default: '2024-02-02',
  })
    startDate: Date;

  @ApiPropertyOptional({
    description: '조회할 종료일',
    default: '2024-02-10',
  })
    endDate: Date;

  @ApiPropertyOptional({
    description: '조회할 태그(특전)ID',
    default:
      '427ccba2-beb2-43,484f52cb-016f-48,5790e618-cb78-4d,64ab26ab-274c-49',
  })
    tags: string;

  @ApiPropertyOptional({
    description: '페이지',
    default: 1,
  })
    page: number;

  @ApiPropertyOptional({
    description: '데이터 개수',
    default: 12,
  })
    size: number;
}
