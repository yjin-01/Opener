import {
  IsString, IsDate, IsEnum, IsBoolean, IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventTypeEnum, SnsTypeEnum } from '../entity/event.enum';

export class EventCreateRequest {
  @ApiProperty({ description: '행사 장소명', default: '127 Day 기념 카페' })
  @IsString()
    placeName: string;

  @ApiProperty({
    description: '행사의 타입',
    default: '카페',
    type: 'enum',
    enum: EventTypeEnum,
  })
  @IsEnum(EventTypeEnum)
    eventType: EventTypeEnum;

  @ApiProperty({
    description: '행사 참여자 artistId 리스트',
    default: ['1fab0958-dafc-48', '454d54d7-a6c8-4c'],
  })
  @IsArray()
    artists: string[];

  @ApiProperty({
    description: '행사 시작일',
    default: '2024-01-24',
  })
  @IsDate()
    startDate: Date;

  @ApiProperty({
    description: '행사 종료일',
    default: '2024-01-31',
  })
  @IsDate()
    endDate: Date;

  @ApiProperty({
    description: '행사 주소',
    default: '서울시 마포구 ~~',
  })
  @IsString()
    address: string;

  @ApiProperty({
    description: '행사 상세 주소',
    default: '',
  })
  @IsString()
    addressDetail: string;

  @ApiProperty({
    description: '행사를 등록하는 유저의 아이디',
    default: 'a1eef6ad-3847-46',
  })
  @IsString()
    userId: string;

  @ApiPropertyOptional({
    description: '행사 관련 이미지',
    default: ['http://image.co.kr', 'http://image.co.kr'],
  })
  @IsArray()
    eventImages: string[];

  @ApiPropertyOptional({
    description: '행사 설명',
    default: 'nct 127 127day 기념 카페!',
  })
  @IsString()
    description: string;

  @ApiPropertyOptional({
    description: '행사관련 Url',
    default: 'https://event.com',
  })
  @IsString()
    eventUrl: string;

  @ApiPropertyOptional({
    description: '행사 주최자 SNS 아이디',
    default: 'nct127',
  })
  @IsString()
    organizerSns: string;

  @ApiPropertyOptional({
    description: '주최자 SNS의 타입',
    default: '유튜브',
    type: 'enum',
    enum: SnsTypeEnum,
  })
  @IsEnum(SnsTypeEnum)
    snsType: SnsTypeEnum;

  @ApiPropertyOptional({
    description: '행사 특전 태그 리스트',
    default: ['5790e618-cb78-4d', '64ab26ab-274c-49'],
  })
  @IsArray()
    tags: string[];

  @ApiProperty({
    description: '등록에 대한 동의 여부',
    default: true,
  })
  @IsBoolean()
    isAgreed: boolean;
}
