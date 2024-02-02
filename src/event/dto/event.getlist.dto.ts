import {
  IsString, IsDate, IsInt, IsArray,
} from 'class-validator';

export class EventGetListDto {
  @IsString()
    keyword: string;

  @IsString()
    sido: string;

  @IsString()
    gungu: string;

  @IsDate()
    startDate: Date;

  @IsDate()
    endDate: Date;

  @IsArray()
    tags: string[];

  @IsInt()
    page: number;

  @IsInt()
    size: number;
}
