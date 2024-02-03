import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsString, IsDate, IsInt, IsArray,
} from 'class-validator';

@Exclude()
export class EventListQueryDto {
  @Expose()
  @Type(() => String)
  @IsString()
    keyword: string;

  @Expose()
  @Type(() => String)
  @IsString()
    sido: string;

  @Expose()
  @Type(() => String)
  @IsString()
    gungu: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
    startDate: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
    endDate: Date;

  @Expose()
  @IsArray()
    tags: string[];

  @Expose()
  @Type(() => Number)
  @IsInt()
    page: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
    size: number;
}
