import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';
import { EventTypeEnum, SnsTypeEnum } from '../entity/event.enum';
import { ArtistList } from './event.artist.list.response';
import { TagList } from './event.tag.list.response';
import { EventImage } from '../entity/event.image.entity';

@Entity('events')
export class EventResponse {
  @ApiProperty({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
    id: string;

  @ApiProperty({
    description: '장소명',
    default: '127 Day 기념 팝업스토어',
  })
    placeName: string;

  @ApiProperty({
    description: '설명',
    default: 'nct 127 127day 기념 팝업스토어!',
  })
    description: string;

  @ApiProperty({
    description: '이벤트 타입',
    default: '팝업스토어',
  })
    eventType: EventTypeEnum;

  @ApiProperty({
    description: '시작일',
    default: '2024-01-31T15:00:00.000Z',
  })
    startDate: Date;

  @ApiProperty({
    description: '종료일',
    default: '2024-02-06T15:00:00.000Z',
  })
    endDate: Date;

  @ApiProperty({
    description: '이벤트 URL',
    default: 'https://event.com',
  })
    eventUrl: string;

  @ApiProperty({
    description: '주최자 SNS',
    default: 'nct127',
  })
    organizerSns: string;

  @ApiProperty({
    description: 'SNS 타입',
    default: '유튜브',
  })
    snsType: SnsTypeEnum;

  @ApiProperty({
    description: '주소',
    default: '서울시 영등포구 ~~',
  })
    address: string;

  @ApiProperty({
    description: '상세주소',
    default: '127-1',
  })
    addressDetail: string;

  @ApiProperty({
    description: '동의 여부',
    default: true,
    type: Boolean,
  })
    isAgreed: boolean;

  @ApiProperty({
    description: '이벤트 이미지',
    type: [EventImage],
  })
    eventImages: EventImage[];

  @ApiProperty({
    description: '작성자 정보',
    type: User,
  })
    userId: User;

  @ApiProperty({
    type: [ArtistList],
    description: '참가 아티스트',
  })
    targetArtists: ArtistList[];

  @ApiProperty({
    type: [TagList],
    description: '태그(특전)',
  })
    eventTags: TagList[];

  @ApiProperty({
    description: '이벤트 작성일',
    default: '2024-02-02',
  })
    createdAt: Date;

  @ApiProperty({
    description: '이벤트 수정일',
    default: '2024-02-02',
  })
    updatedAt: Date;

  @ApiProperty({
    description: '이벤트 삭제일',
    default: '2024-02-02',
  })
    deletedAt: Date;
}
