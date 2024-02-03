import { ApiPropertyOptional } from '@nestjs/swagger';

export class TagList {
  @ApiPropertyOptional({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
    eventId: string;

  @ApiPropertyOptional({
    description: '태그 ID',
    default: '',
  })
    tagId: string;

  @ApiPropertyOptional({
    description: '태그 이름',
    default: '포토카드',
  })
    tagName: string;
}
