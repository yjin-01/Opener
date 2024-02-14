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
  Generated,
} from 'typeorm';
import { Event } from 'src/event/entity/event.entity';
import { User } from 'src/user/entity/user.entity';
import { ReviewImage } from './review.imege.entity';
import { ReviewLike } from './review.like.entity';
import { ReviewClaim } from './review.claim.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
    sequence: number;

  @Column('uuid')
  @Generated('uuid')
    id: string;

  @Column('uuid', { name: 'user_id' })
    userId: string;

  @Column('uuid', { name: 'event_id' })
    eventId: string;

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

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
    user: User;

  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  @ManyToOne(() => Event, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
    event: Event;

  @OneToMany(() => ReviewImage, (image) => image.review)
  @JoinColumn({ name: 'id', referencedColumnName: 'review_id' })
    reviewImages: ReviewImage[];

  @OneToMany(() => ReviewLike, (like) => like.review)
  @JoinColumn({ name: 'id', referencedColumnName: 'review_id' })
    reviewLikes: ReviewLike[];

  @OneToMany(() => ReviewClaim, (claim) => claim.review)
  @JoinColumn({ name: 'id', referencedColumnName: 'review_id' })
    reviewClaims: ReviewClaim[];
}
