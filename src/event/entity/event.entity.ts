import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Review } from 'src/review/entity/review.entity';
import { EventTypeEnum, SnsTypeEnum } from './event.enum';
import { EventTarget } from './event.target.entity';
import { EventTag } from './event.tag.entity';
import { EventImage } from './event.image.entity';
import { EventLike } from './event.like.entity';
import { TagList } from '../swagger/event.tag.list.response';
import { ArtistList } from '../swagger/event.artist.list.response';

@Entity('events')
export class Event {
  @ApiPropertyOptional({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiPropertyOptional({
    description: '순서 정보',
    default: '1',
  })
  @Type(() => Number)
  @Column({ type: 'bigint' })
    sequence: BigInt;

  @ApiPropertyOptional({
    description: '장소명',
    default: '127 Day 기념 팝업스토어',
  })
  @Column({ name: 'place_name' })
    placeName: string;

  @ApiPropertyOptional({
    description: '설명',
    default: 'nct 127 127day 기념 팝업스토어!',
  })
  @Column()
    description: string;

  @ApiPropertyOptional({
    description: '이벤트 타입',
    default: '팝업스토어',
  })
  @Column({
    name: 'event_type',
    type: 'enum',
    comment: '행사 타입',
    nullable: false,
    enum: EventTypeEnum,
  })
  @IsEnum(EventTypeEnum)
    eventType: EventTypeEnum;

  @ApiPropertyOptional({
    description: '시작일',
    default: '2024-01-31T15:00:00.000Z',
  })
  @Column({ name: 'start_date' })
    startDate: Date;

  @ApiPropertyOptional({
    description: '종료일',
    default: '2024-02-06T15:00:00.000Z',
  })
  @Column({ name: 'end_date' })
    endDate: Date;

  @ApiPropertyOptional({
    description: '이벤트 URL',
    default: 'https://event.com',
  })
  @Column({ name: 'event_url' })
    eventUrl: string;

  @ApiPropertyOptional({
    description: '작성자 ID',
    default: '',
  })
  @Column({ name: 'user_id' })
    userId: string;

  @ApiProperty({
    description: '이벤트 URL',
    default: 'https://event.com',
  })
  @Column({ name: 'organizer_sns' })
    organizerSns: string;

  @ApiProperty({
    description: '주최자 SNS',
    default: 'nct127',
  })
  @Column({
    name: 'sns_type',
    type: 'enum',
    comment: '주최자 SNS 타입',
    nullable: true,
    enum: SnsTypeEnum,
  })
  @IsEnum(SnsTypeEnum)
    snsType: SnsTypeEnum;

  @ApiProperty({
    description: '주소',
    default: '서울시 영등포구 ~~',
  })
  @Column()
    address: string;

  @ApiProperty({
    description: '상세주소',
    default: '127-1',
  })
  @Column({ name: 'address_detail' })
    addressDetail: string;

  @ApiPropertyOptional({
    description: '동의 여부',
    default: true,
    type: Boolean,
  })
  @Column({ name: 'is_agreed' })
    isAgreed: boolean;

  @ApiPropertyOptional({
    description: '행사 작성일',
    default: '',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
    createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
    updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
    deletedAt: Date;

  @ApiPropertyOptional({
    type: Object,
    name: 'user',
  })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.event)
    user: string;

  @ApiPropertyOptional({
    type: [ArtistList],
    description: '참가 아티스트',
  })
  @OneToMany(() => EventTarget, (eventTarget) => eventTarget.eventId)
    targetArtists: EventTarget[];

  @ApiPropertyOptional({
    type: [TagList],
    description: '태그(특전)',
  })
  @OneToMany(() => EventTag, (eventTag) => eventTag.eventId)
    eventTags: EventTag[];

  @ApiPropertyOptional({
    type: [EventImage],
    description: '참가 아티스트',
  })
  @OneToMany(() => EventImage, (eventEmage) => eventEmage.event)
    eventImages: EventImage[];

  @OneToMany(() => EventLike, (eventLike) => eventLike.event)
    eventLikes: EventLike[];

  @OneToMany(() => Review, (review) => review.event)
  @JoinColumn({ name: 'id', referencedColumnName: 'event_id' })
    reviews: Review[];

  // 이 컬럼은 실제 테이블에 추가되지 않습니다.
  @ApiPropertyOptional({
    description: '좋아요',
  })
  @Type(() => Number)
    likeCount: number;

  @ApiPropertyOptional({
    description: '로그인한 user의 좋아요 여부',
  })
  @Type(() => Boolean)
    isLike: Boolean;
}
