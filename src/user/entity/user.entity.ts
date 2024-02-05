import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Review } from 'src/review/entity/review.entity';
import { Event } from 'src/event/entity/event.entity';
import { UserToArtist } from './user.artist.entity';
// https://stackoverflow.com/questions/46589957/es6-modules-and-circular-dependency/46593566#46593566
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    username: string;

  @Column({ name: 'signup_method' })
    signupMethod: string;

  @Column()
    password: string;

  @Column()
    email: string;

  @Column()
    alias: string;

  @Column({ name: 'profile_image' })
    profileImage: string;

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

  @OneToMany(() => UserToArtist, (userArtist) => userArtist.user)
    userArtists: UserToArtist[];

  @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

  @OneToMany(() => Event, (event) => event.user)
    event: Event[];
}
