import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { EventTypeEnum, SnsTypeEnum } from './event.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid', { name: 'event_id' })
    eventId: string;

  @Column({ name: 'place_name' })
    placeName: string;

  @Column()
    description: string;

  @Column({
    name: 'event_type',
    type: 'enum',
    comment: '행사 타입',
    nullable: false,
    enum: EventTypeEnum,
  })
  @IsEnum(EventTypeEnum)
    eventType: EventTypeEnum;

  @Column({ name: 'start_date' })
    startDate: Date;

  @Column({ name: 'end_date' })
    endDate: Date;

  @Column({ name: 'event_url' })
    eventUrl: string;

  @Column({ name: 'user_id' })
    userId: string;

  @Column({ name: 'organizer_sns' })
    organizerSns: string;

  @Column({
    name: 'sns_type',
    type: 'enum',
    comment: '주최자 SNS 타입',
    nullable: true,
    enum: SnsTypeEnum,
  })
  @IsEnum(SnsTypeEnum)
    snsType: SnsTypeEnum;

  @Column()
    address: string;

  @Column({ name: 'address_detail' })
    addressDetail: string;

  @Column({ name: 'is_agreed' })
    isAgreed: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
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
}
