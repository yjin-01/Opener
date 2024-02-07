import {
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventTypeEnum, SnsTypeEnum } from '../entity/event.enum';

export class EventUpdateRequest {
  @ApiProperty({ description: '행사 장소명', default: '127 Day 기념 카페' })
  @IsString()
  @IsOptional()
    placeName: string;

  @ApiProperty({
    description: '행사의 타입',
    default: '카페',
    type: 'enum',
    enum: EventTypeEnum,
  })
  @IsOptional()
  @IsEnum(EventTypeEnum)
    eventType: EventTypeEnum;

  @ApiPropertyOptional({
    description: '행사 참여자가 그룹인 경우 groupId',
    default: 'e073b452-9edd-41',
  })
  @IsOptional()
  @IsString()
    groupId: string;

  @ApiProperty({
    description: '행사 참여자 artistId 리스트',
    default: ['1fab0958-dafc-48', '454d54d7-a6c8-4c'],
  })
  @IsOptional()
  @IsArray()
    artists: string[];

  @ApiProperty({
    description: '행사 시작일',
    default: '2024-01-24',
  })
  @IsOptional()
  //   @IsDate()
    startDate: Date;

  @ApiProperty({
    description: '행사 종료일',
    default: '2024-01-31',
  })
  @IsOptional()
  //   @IsDate()
    endDate: Date;

  @ApiProperty({
    description: '행사 주소',
    default: '서울시 마포구 ~~',
  })
  @IsOptional()
  @IsString()
    address: string;

  @ApiProperty({
    description: '행사 상세 주소',
    default: '',
  })
  @IsOptional()
  @IsString()
    addressDetail: string;

  @ApiPropertyOptional({
    description: '행사 관련 이미지',
    default: ['http://image.co.kr', 'http://image.co.kr'],
  })
  @IsOptional()
  @IsArray()
    eventImages: string[];

  @ApiPropertyOptional({
    description: '행사 설명',
    default: 'nct 127 127day 기념 카페!',
  })
  @IsOptional()
  @IsString()
    description: string;

  @ApiPropertyOptional({
    description: '행사관련 Url',
    default: 'https://event.com',
  })
  @IsOptional()
  @IsString()
    eventUrl: string;

  @ApiPropertyOptional({
    description: '행사 주최자 SNS 아이디',
    default: 'nct127',
  })
  @IsOptional()
  @IsString()
    organizerSns: string;

  @ApiPropertyOptional({
    description: '주최자 SNS의 타입',
    default: '유튜브',
    type: 'enum',
    enum: SnsTypeEnum,
  })
  @IsOptional()
  @IsEnum(SnsTypeEnum)
    snsType: SnsTypeEnum;

  @ApiPropertyOptional({
    description: '행사 특전 태그 리스트',
    default: ['5790e618-cb78-4d', '64ab26ab-274c-49'],
  })
  @IsOptional()
  @IsArray()
    tags: string[];

  @ApiProperty({
    description: '등록에 대한 동의 여부',
    default: true,
  })
  @IsBoolean()
    isAgreed: boolean;
}
