import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from 'src/artist/entity/artist.entity';
import { Group } from 'src/group/entity/group.entity';
import { Event } from './event.entity';

@Entity('event_targets')
export class EventTarget {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @JoinColumn({ name: 'event_id' })
  @ManyToOne(() => Event, (event) => event.targetArtists)
    eventId: string;

  @JoinColumn({ name: 'artist_id' })
  @ManyToOne(() => Artist, (artist) => artist.id)
    artistId: string;

  @JoinColumn({ name: 'group_id' })
  @ManyToOne(() => Group, (group) => group.id)
    groupId: string;

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
