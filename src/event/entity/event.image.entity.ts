import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity('event_images')
export class EventImage {
  @ApiProperty({
    description: '이미지 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiProperty({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @JoinColumn({ name: 'event_id' })
  @ManyToOne(() => Event, (event) => event.eventImages)
    eventId: string;

  @ApiProperty({
    description: '이미지 URL',
    default: '~~',
  })
  @Column({ name: 'event_image' })
    eventImage: string;

  @ApiProperty({
    description: '메인 이미지 여부',
    default: true,
    type: Boolean,
  })
  @Column({ name: 'main_image' })
    mainImage: boolean;

  @ApiProperty({
    description: '이벤트 작성일',
    default: '2024-02-02',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @ApiProperty({
    description: '이벤트 수정일',
    default: '2024-02-02',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
    updatedAt: Date;

  @ApiProperty({
    description: '이벤트 삭제일',
    default: '2024-02-02',
  })
  @DeleteDateColumn({
    name: 'deleted_at',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
    deletedAt: Date;
}
