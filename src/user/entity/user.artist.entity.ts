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
import { Exclude, Expose } from 'class-transformer';
import { User } from './user.entity';
// https://stackoverflow.com/questions/46589957/es6-modules-and-circular-dependency/46593566#46593566
@Exclude()
@Entity('users_artists')
export class UserToArtist {
  constructor(userId, artistId) {
    this.userId = userId;
    this.artistId = artistId;
  }

  @Expose()
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Expose()
  @Column('uuid', { name: 'user_id' })
    userId: string;

  @Expose()
  @Column('uuid', { name: 'artist_id' })
    artistId: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'NOW()',
  })
    createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    onUpdate: 'NOW()',
    nullable: true,
  })
    updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    onUpdate: 'NOW()',
    nullable: true,
  })
    deletedAt: Date;

  @ManyToOne(() => User, (user) => user.userArtists)
  @JoinColumn({ name: 'user_id' })
    user: User;
}
