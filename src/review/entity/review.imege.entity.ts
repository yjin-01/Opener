import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('review_images')
export class ReviewImage {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @PrimaryColumn({ name: 'user_id' })
    userId: string;

  @PrimaryColumn({ name: 'review_id' })
    reviewId: string;

  @Column()
    url: string;

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

  @JoinColumn({ name: 'review_id', referencedColumnName: 'id' })
  @ManyToOne(() => Review, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
    review: Review;
}
