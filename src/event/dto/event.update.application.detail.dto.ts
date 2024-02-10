import { ApiProperty } from '@nestjs/swagger';
import { EventUpdateApplication } from '../entity/event.update.application.entity';
import { Event } from '../entity/event.entity';

export class EventUpdateApplicationDetailDto {
  @ApiProperty({ description: '신청 정보' })
    applicationDetail: EventUpdateApplication;

  @ApiProperty({
    description: '기존 이벤트 정보',
  })
    originEvent: Event;
}
