import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Group } from 'src/group/entity/group.entity';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistResponse } from './dto/artist.response';
import { Artist } from './entity/artist.entity';
import { ArtistGroup } from './entity/artist_group.entity';

@Injectable()
export class ArtistRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findAllArtsit(
    category: string,
    keyword: string,
  ): Promise<ArtistResponse[] | null> {
    const query = this.entityManager
      .getRepository(Artist)
      .createQueryBuilder('artist')
      .where('1=1');

    if (category === 'artist' && keyword) {
      query.andWhere('artist.artist_name LIKE :artistName', {
        artistName: `%${keyword}%`,
      });
    }

    query
      .leftJoin(
        ArtistGroup,
        'artistGroup',
        'artistGroup.artist_id = artist.artist_id',
      )
      .leftJoin(Group, 'group', 'group.group_id = artistGroup.group_id');

    if (category === 'group' && keyword) {
      query.andWhere('group.group_name LIKE :groupName', {
        groupName: `%${keyword}%`,
      });
    }

    query
      .select([
        'artist.artist_id',
        'artist.artist_name',
        'artist.birthday',
        'artist.artist_image',
        'group.group_id',
        'group.group_name',
      ])
      .orderBy('group.group_id', 'DESC')
      .getRawMany();

    const artistList = await query.getRawMany();

    return artistList;
  }

  async findAllArtsitByGroup(
    groupId: string,
  ): Promise<ArtistResponse[] | null> {
    const artistList = await this.entityManager
      .getRepository(Artist)
      .createQueryBuilder('artist')
      .leftJoin(
        ArtistGroup,
        'artistGroup',
        'artistGroup.artist_id = artist.artist_id',
      )
      .where('artistGroup.group_id = :groupId', {
        groupId,
      })
      .leftJoin(Group, 'group', 'group.group_id = artistGroup.group_id')
      .select([
        'artist.artist_id',
        'artist.artist_name',
        'artist.birthday',
        'artist.artist_image',
        'group.group_id',
        'group.group_name',
      ])

      .getRawMany();

    return artistList;
  }

  async createArtist(
    artistInfo: ArtistCreateRequest,
  ): Promise<ArtistResponse | null> {
    try {
      const insertArtist = await this.entityManager
        .getRepository(Artist)
        .createQueryBuilder()
        .insert()
        .into(Artist)
        .values([artistInfo])
        .execute();

      if (insertArtist.raw === 0) {
        throw new InternalServerErrorException();
      }

      const artistId = insertArtist.identifiers[0].artistId.slice(0, 16);

      // groupId가 없는 경우
      if (!artistInfo.groupId) {
        const newArtist = await this.entityManager
          .getRepository(Artist)
          .findOneBy({
            artistId,
          });

        return newArtist;
      }

      // groupId가 있는 경우 group_artist테이블 저장
      await this.entityManager
        .getRepository(ArtistGroup)
        .createQueryBuilder()
        .insert()
        .into(ArtistGroup)
        .values({
          artistId,
          groupId: artistInfo.groupId,
        })
        .execute();

      const artist = await this.entityManager
        .getRepository(Artist)
        .createQueryBuilder('artist')
        .leftJoin(
          ArtistGroup,
          'artistGroup',
          'artistGroup.artist_id = artist.artist_id',
        )
        .where('artistGroup.artist_id = :artistId', {
          artistId,
        })
        .andWhere('artistGroup.group_id = :groupId', {
          groupId: artistInfo.groupId,
        })
        .leftJoin(Group, 'group', 'group.group_id = artistGroup.group_id')
        .select([
          'artist.artist_id',
          'artist.artist_name',
          'artist.birthday',
          'artist.artist_image',
          'group.group_id',
          'group.group_name',
        ])
        .getRawOne();

      return artist;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
