import { IsNumber, IsOptional } from 'class-validator';
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

  @IsOptional()
  private userId: string;

  getCursorId() {
    return this.cursorId;
  }

  getSize() {
    return this.size;
  }

  getUserId() {
    return this.userId;
  }
}
