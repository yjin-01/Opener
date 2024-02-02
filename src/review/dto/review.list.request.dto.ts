import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewListRequestParamDto {
  private eventId: string;

  getEventId() {
    return this.eventId;
  }
}

export class ReviewListRequestQueryDto {
  @IsNumber()
  @Type(() => Number)
  private cursorId: number;

  @IsNumber()
  @Type(() => Number)
  private size: number;

  getCursorId() {
    return this.cursorId;
  }

  getSize() {
    return this.size;
  }
}
