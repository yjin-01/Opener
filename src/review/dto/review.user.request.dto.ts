import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewUserRequestParamDto {
  private userId: string;

  getUserId() {
    return this.userId;
  }
}

export class ReviewUserRequestQueryDto {
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
