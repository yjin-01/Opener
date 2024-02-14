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
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Event } from './event.entity';

@Entity('event_images')
export class EventImage {
  @ApiPropertyOptional({
    description: '이미지 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiPropertyOptional({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @Column({ name: 'event_id' })
    eventId: string;

  @ApiPropertyOptional({
    description: '이미지 URL',
    default: '~~',
  })
  @Column({ name: 'image_url' })
    imageUrl: string;

  @ApiPropertyOptional({
    description: '순서 정보',
    default: '1',
  })
  @Type(() => Number)
  @Column()
    sequence: number;

  @ApiPropertyOptional({
    description: '메인 이미지 여부',
    default: true,
    type: Boolean,
  })
  @Column({ name: 'is_main' })
    isMain: boolean;

  @ApiPropertyOptional({
    description: '이벤트 작성일',
    default: '2024-02-02',
  })
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

  @JoinColumn({ name: 'event_id' })
  @ManyToOne(() => Event, (event) => event.eventImages)
    event: string;
}
