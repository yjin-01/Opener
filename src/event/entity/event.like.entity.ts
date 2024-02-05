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
import { Event } from './event.entity';

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

  @JoinColumn({ name: 'event_id' })
  @ManyToOne(() => Event, (event) => event.eventLikes)
    event: Event;
}
