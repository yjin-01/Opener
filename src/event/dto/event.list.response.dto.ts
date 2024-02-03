import { Exclude, Expose } from 'class-transformer';
import { Event } from '../entity/event.entity';

@Exclude()
export class EventListResponseDto {
  @Expose()
    eventList: Event[];

  @Expose()
    size: number;

  @Expose()
    cursorId: number | null;
}
