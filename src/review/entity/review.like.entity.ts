import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('review_likes')
export class ReviewLike {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    userId: string;

  @Column()
    reviewId: string;

  @Column()
    isLike: boolean;

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

  @JoinColumn({ name: 'review_id' })
  @ManyToOne(() => Review, (review) => review.reviewLikes)
    review: Review;
}
