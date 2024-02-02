import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { ReviewImage } from './review.imege.entity';
import { ReviewLike } from './review.like.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column('uuid', { name: 'user_id' })
    userId: string;

  @Column('uuid', { name: 'event_id' })
    eventId: string;

  @Column()
    sequence: number;

  @Column({ name: 'is_public' })
    isPublic: boolean;

  @Column({ name: 'is_agree' })
    isAgree: boolean;

  @Column()
    rating: boolean;

  @Column()
    description: string;

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

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
    user: User;

  @OneToMany(() => ReviewImage, (image) => image.review)
    reviewImages: ReviewImage[];

  @OneToMany(() => ReviewLike, (like) => like.review)
    reviewLikes: ReviewLike;
}
