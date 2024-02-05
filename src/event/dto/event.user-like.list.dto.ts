import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class EventUserLikeListQueryDto {
  @Expose()
  @Type(() => String)
  @IsOptional()
    status: string;

  @Expose()
  @Type(() => Date)
  @IsOptional()
    targetDate: Date;

  @Expose()
  @Type(() => Number)
  @IsOptional()
    size: number = 12;

  @Expose()
  @Type(() => Number)
  @IsOptional()
    cursorId: BigInt | null;
}
