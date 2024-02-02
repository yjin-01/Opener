import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventListResponse } from './event.geteventlist.response';

export class EventGetListRespone {
  @ApiProperty({
    description: '페이지',
    default: 1,
  })
    page: number;

  @ApiProperty({
    description: '데이터 개수',
    default: 12,
  })
    size: number;

  @ApiPropertyOptional({
    description: '이벤트 ID',
    type: [EventListResponse],
  })
    eventList: EventListResponse[];
}
