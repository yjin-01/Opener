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
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'group_name' })
    groupName: string;

  @Column({ name: 'debut_date' })
    debutDate: Date;

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
