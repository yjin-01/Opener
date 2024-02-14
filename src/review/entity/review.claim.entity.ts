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
import { User } from 'src/user/entity/user.entity';
import { Review } from './review.entity';

@Entity('review_claims')
export class ReviewClaim {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column('uuid', { name: 'user_id' })
    userId: string;

  @Column('uuid', { name: 'review_id' })
    reviewId: string;

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

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
    user: User;

  @JoinColumn({ name: 'review_id', referencedColumnName: 'id' })
  @ManyToOne(() => Review, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
    review: Review;
}
