import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EventUpdateApproval } from './event.update.approval.entity';

@Entity('event_update_applications')
export class EventUpdateApplication {
  @ApiPropertyOptional({
    description: '수정 신청ID',
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: '',
  })
  @Column({ name: 'event_id' })
    eventId: string;

  @ApiProperty({
    description: '유저 ID',
    example: '',
  })
  @Column({ name: 'user_id' })
    userId: string;

  @ApiProperty({
    description: '수정된 카테고리',
    example: 'placeName',
  })
  @Column({ name: 'update_category' })
    updateCategory: string;

  @ApiProperty({
    description: '수정 내용',
    example: '',
  })
  @Column({ name: 'update_data' })
    updateData: string;

  @ApiProperty({
    description: '승인 개수',
    example: '',
  })
  @Type(() => Number)
  @Column({ name: 'approval_count' })
    approvalCount: number;

  @ApiProperty({
    description: '거절 개수',
    example: '',
  })
  @Type(() => Number)
  @Column({ name: 'rejection_count' })
    rejectionCount: number;

  @ApiProperty({
    description: '반영 여부',
    default: true,
    type: Boolean,
  })
  @Column({ name: 'is_reflected' })
    isReflected: boolean;

  @ApiPropertyOptional({
    description: '신청일',
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

  @OneToMany(
    () => EventUpdateApproval,
    (eventUpdateApproval) => eventUpdateApproval.eventUpdateApplication,
  )
    eventUpdateApproval: string[];
}
