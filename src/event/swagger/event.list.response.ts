import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from '../entity/event.entity';

export class EventListByPageRespone {
  @ApiProperty({
    description: '페이지',
    default: 1,
  })
    totalCount: number;

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
    type: [Event],
  })
    eventList: Event[];
}

export class EventListByCursorRespone {
  @ApiProperty({
    description: 'cursorId 다음 데이터 없는 경우 null',
  })
    cursorId: BigInt | null;

  @ApiProperty({
    description: '데이터 개수',
    default: 12,
  })
    size: number;

  @ApiPropertyOptional({
    description: '이벤트 ID',
    type: [Event],
  })
    eventList: Event[];
}
