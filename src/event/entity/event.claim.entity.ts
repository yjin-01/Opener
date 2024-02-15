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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity('event_claims')
export class EventClaim {
  @ApiPropertyOptional({
    description: '신고 ID',
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
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
    description: '신고 내용',
    default: '~~',
  })
  @Column()
    description: string;

  @ApiPropertyOptional({
    description: '신고일',
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
