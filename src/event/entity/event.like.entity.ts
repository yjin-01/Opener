import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('event_likes')
export class EventLike {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'user_id' })
    userId: string;

  @Column({ name: 'event_id' })
    eventId: string;

  @CreateDateColumn({
    name: 'created_at',
  })
    createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
    updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
    deletedAt: Date;
}
