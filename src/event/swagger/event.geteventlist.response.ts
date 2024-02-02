import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventTypeEnum, SnsTypeEnum } from '../entity/event.enum';
import { ArtistList } from './artistList';
import { TagList } from './tagList';

export class EventListResponse {
  @ApiPropertyOptional({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
    eventId: string;

  @ApiPropertyOptional({
    description: '장소명',
    default: '127 Day 기념 팝업스토어',
  })
    placeName: string;

  @ApiPropertyOptional({
    description: '설명',
    default: 'nct 127 127day 기념 팝업스토어!',
  })
    description: string;

  @ApiPropertyOptional({
    description: '이벤트 타입',
    default: '팝업스토어',
  })
    eventType: EventTypeEnum;

  @ApiPropertyOptional({
    description: '시작일',
    default: '2024-01-31T15:00:00.000Z',
  })
    startDate: Date;

  @ApiPropertyOptional({
    description: '종료일',
    default: '2024-02-06T15:00:00.000Z',
  })
    endDate: Date;

  @ApiPropertyOptional({
    description: '이벤트 URL',
    default: 'https://event.com',
  })
    eventUrl: string;

  @ApiPropertyOptional({
    description: '주최자 SNS',
    default: 'nct127',
  })
    organizerSns: string;

  @ApiPropertyOptional({
    description: 'SNS 타입',
    default: '유튜브',
  })
    snsType: SnsTypeEnum;

  @ApiPropertyOptional({
    description: '주소',
    default: '서울시 영등포구 ~~',
  })
    address: string;

  @ApiPropertyOptional({
    description: '상세주소',
    default: '127-1',
  })
    addressDetail: string;

  @ApiPropertyOptional({
    description: '메인 이미지 URL',
    default: 'http://image.co.kr',
  })
    mainImage: string;

  @ApiPropertyOptional({
    description: '작성자ID',
    default: '~~~',
  })
    writerId: string;

  @ApiPropertyOptional({
    description: '작성자 별칭',
    default: 'test',
  })
    writerAlias: string;

  @ApiPropertyOptional({
    type: [ArtistList],
    description: '참가 아티스트',
  })
    targetArtists: ArtistList[];

  @ApiPropertyOptional({
    type: [TagList],
    description: '태그(특전)',
  })
    eventTags: TagList[];
}
