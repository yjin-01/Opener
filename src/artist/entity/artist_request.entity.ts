import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('artist_requests')
export class ArtistRequest {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    name: string;

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
