import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventListRequest {
  @ApiPropertyOptional({
    description: '조회할 그룹명 또는 아티스트이름',
    example: 'test',
  })
    keyword: string;

  @ApiPropertyOptional({
    description: '조회할 시/도',
    example: '서울',
  })
    sido: string;

  @ApiPropertyOptional({
    description: '조회할 시/군/구',
    example: '영등포',
  })
    gungu: string;

  @ApiPropertyOptional({
    description: '조회할 시작일',
    example: '2024-02-02',
  })
    startDate: Date;

  @ApiPropertyOptional({
    description: '조회할 종료일',
    example: '2024-02-10',
  })
    endDate: Date;

  @ApiPropertyOptional({
    description: '조회할 태그(특전)ID',
    example:
      '427ccba2-beb2-43,484f52cb-016f-48,5790e618-cb78-4d,64ab26ab-274c-49',
  })
    tags: string;

  @ApiProperty({
    description: '정렬 기준',
    examples: {
      example1: {
        description: '최신순 정렬',
        value: '최신순',
      },
      example2: {
        description: '인기순 정렬',
        value: '인기순',
      },
    },
  })
    sort: string;

  @ApiPropertyOptional({
    description: '페이지',
    example: 1,
  })
    page: number;

  @ApiPropertyOptional({
    description: '데이터 개수',
    example: 12,
  })
    size: number;
}
