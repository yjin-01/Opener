import { Exclude, Expose, Type } from 'class-transformer';
import { Event } from '../entity/event.entity';

@Exclude()
export class EventListByPageResponseDto {
  @Expose()
    size?: number;

  @Expose()
    page?: number;

  @Expose()
    totalCount?: number;

  @Expose()
  @Type(() => Event)
    eventList: Event[];
}

@Exclude()
export class EventListByCursorRespone {
  @Expose()
    cursorId: BigInt | null;

  @Expose()
    size: number;

  @Expose()
    eventList: Event[];
}
