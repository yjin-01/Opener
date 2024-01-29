import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid', { name: 'tag_id' })
    tagId: string;

  @Column({ name: 'tag_name' })
    tagName: string;

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
