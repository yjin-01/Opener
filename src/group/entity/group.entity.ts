import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('groups')
export class Group {
  @ApiProperty({
    description: '그룹 ID',
    default: '5c6141ab-cf30-48',
  })
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ApiProperty({
    description: '그룹 이름',
    default: '~~~',
  })
  @Column({ name: 'group_name' })
    groupName: string;

  @ApiProperty({
    description: '그룹 데뷔일',
    default: '~~~',
  })
  @Column({ name: 'debut_date' })
    debutDate: Date;

  @ApiPropertyOptional({
    description: '그룹 이미지',
    default: '~~~',
  })
  @Column({ name: 'group_image' })
    groupImage: string;

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
