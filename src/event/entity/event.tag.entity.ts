import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Event } from './event.entity';
import { Tag } from './tag.entity';

@Entity('event_tags')
export class EventTag {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @JoinColumn({ name: 'tag_id' })
  @ManyToOne(() => Tag, (tag) => tag.id)
    tagId: string;

  @JoinColumn({ name: 'event_id' })
  @ManyToOne(() => Event, (event) => event.eventTags)
    eventId: string;

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
