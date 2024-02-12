import { UserToArtist } from 'src/user/entity/user.artist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ name: 'artist_name' })
    artistName: string;

  @Column()
    birthday: Date;

  @Column({ name: 'artist_image' })
    artistImage: string;

  @Column({ name: 'is_solo' })
    isSolo: boolean;

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

  @OneToMany(() => UserToArtist, (followArtist) => followArtist.artist)
  @JoinColumn({ name: 'id', referencedColumnName: 'artist_id' })
    followArtists: UserToArtist[];
}
