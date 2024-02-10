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
import { EventUpdateApplication } from './event.update.application.entity';

@Entity('event_update_approval')
export class EventUpdateApproval {
  @ApiPropertyOptional({
    description: '수정 신청 승인 및 거절 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiPropertyOptional({
    description: '유저 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @Column({ name: 'user_id' })
    userId: string;

  @Column({ name: 'event_update_application_id' })
    eventUpdateApplicationId: string;

  @ApiPropertyOptional({
    description: '승인 및 거절',
    default: true,
    type: Boolean,
  })
  @Column({ name: 'is_approved' })
    isApproved: boolean;

  @ApiPropertyOptional({
    description: '승인일',
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

  @JoinColumn({ name: 'event_update_application_id' })
  @ManyToOne(
    () => EventUpdateApplication,
    (eventUpdateApplication) => eventUpdateApplication.eventUpdateApproval,
  )
    eventUpdateApplication: string;
}
