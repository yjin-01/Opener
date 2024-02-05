import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsString, IsDate, IsArray, IsOptional,
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
    tags: string;

  @Expose()
  @Type(() => String)
  @IsString()
    sort: string;

  @Expose()
  @Type(() => Number)
  @IsOptional()
    page: number = 1;

  @Expose()
  @Type(() => Number)
  @IsOptional()
    size: number = 12;
}
