/* eslint-disable no-useless-concat */
import * as sql from 'mysql2';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { Artist } from './entity/artist.entity';
import { ArtistGroup } from './entity/artist_group.entity';
import { ArtistListResponse } from './dto/artist.list.response';
import { ArtistRequest } from './entity/artist_request.entity';

@Injectable()
export class ArtistRepository {
  constructor(private readonly entityManager: EntityManager) {}

  // 그룹 + 아티스트(멤버 + 솔로)
  async findAllArtsitAndGroup({
    keyword,
    page,
    size,
  }): Promise<ArtistListResponse | null> {
    const itemsPerPage = size || 12; // 페이지당 아이템 수
    const currentPage = page || 1; // 현재 페이지

    const skip = (currentPage - 1) * itemsPerPage;

    let query = 'SELECT a.id, a.artist_name AS name, a.artist_image AS image, IF(a.is_solo = 1, "solo", "member") as type'
      + ' FROM artists a'
      + ' LEFT JOIN artist_groups ag on ag.artist_id = a.id'
      + ' LEFT JOIN `groups` g on g.id = ag.group_id'
      + ' WHERE 1 = 1 ';

    if (keyword) {
      query += ` AND (a.artist_name LIKE  ${sql.escape(`%${keyword}%`)} or g.group_name LIKE  ${sql.escape(`%${keyword}%`)})`;
    }

    query
      += ' UNION'
      + ' SELECT g.id , g.group_name , g.group_image, "group" as type'
      + ' FROM `groups` g'
      + ' WHERE 1 = 1';

    if (keyword) {
      query += ` AND  g.group_name LIKE  ${sql.escape(`%${keyword}%`)}`;
    }

    query += ` LIMIT ${itemsPerPage} OFFSET ${skip}`;

    const artistAndGroupList = await this.entityManager.query(query);

    return {
      page: currentPage,
      size: itemsPerPage,
      artistAndGroupList,
    };
  }

  async findAllArtsitByGroup(groupId: string): Promise<Artist[] | null> {
    const artistList = await this.entityManager
      .getRepository(Artist)
      .createQueryBuilder('a')
      .leftJoin(ArtistGroup, 'ag', 'ag.artist_id = a.id')
      .where('ag.group_id = :groupId', {
        groupId,
      })
      .select([
        'a.id AS id',
        'a.artist_name AS artistName',
        'a.birthday AS birthday',
        'a.artist_image AS artistImage',
      ])
      .getRawMany();

    return artistList;
  }

  async create(artistInfo: ArtistCreateRequest): Promise<Artist | null> {
    try {
      //  그룹 정보가 없는 경우
      if (!artistInfo.groups || artistInfo.groups.length === 0) {
        const isSolo = true;
        const insertInfo = { ...artistInfo, isSolo };

        const insertArtist = await this.entityManager
          .getRepository(Artist)
          .createQueryBuilder()
          .insert()
          .into(Artist)
          .values([insertInfo])
          .execute();

        if (insertArtist.raw === 0) {
          throw new InternalServerErrorException();
        }

        const { id } = insertArtist.identifiers[0];

        const newArtist = await this.entityManager
          .getRepository(Artist)
          .findOneBy({
            id,
          });

        return newArtist;
      }

      // groups가 있는 경우
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

      const { id } = insertArtist.identifiers[0];

      // group_artist테이블 저장
      const groupDataToInsert = artistInfo.groups.map((el) => ({
        groupId: el,
        artistId: id,
      }));

      await this.entityManager
        .getRepository(ArtistGroup)
        .createQueryBuilder()
        .insert()
        .into(ArtistGroup)
        .values(groupDataToInsert)
        .execute();

      const newArtist = await this.entityManager
        .getRepository(Artist)
        .findOneBy({
          id,
        });

      return newArtist;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createArtistRequest(artistRequest): Promise<number | null> {
    try {
      const { identifiers } = await this.entityManager
        .getRepository(ArtistRequest)
        .createQueryBuilder()
        .insert()
        .into(ArtistRequest)
        .values(artistRequest)
        .execute();
      return identifiers[0].id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
