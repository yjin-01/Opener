import * as sql from 'mysql2';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GroupCreateRequest } from './dto/group.create.request';
import { Group } from './entity/group.entity';
import { GroupListResponse } from './dto/group.list.response';

@Injectable()
export class GroupRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findAllGroupAndSolo({
    keyword,
    page,
    size,
  }): Promise<GroupListResponse | null> {
    try {
      const itemsPerPage = size || 12; // 페이지당 아이템 수
      const currentPage = page || 1; // 현재 페이지

      const skip = (currentPage - 1) * itemsPerPage;

      let query = 'SELECT a.id, a.artist_name AS name, a.artist_image AS image, "solo" as type'
        + ' FROM artists a'
        + ' WHERE 1 = 1 '
        + ' AND a.is_solo = 1';

      if (keyword) {
        query += ` AND a.artist_name LIKE  ${sql.escape(`%${keyword}%`)}`;
      }

      query
        += ' UNION'
        + ' SELECT g.id , g.group_name , g.group_image, "group" as type'
        + ' FROM `groups` g'
        + ' LEFT JOIN artist_groups ag ON ag.group_id = g.id'
        + ' LEFT JOIN artists a ON a.id = ag.artist_id'
        + ' WHERE 1 = 1';

      if (keyword) {
        query += ` AND (a.artist_name LIKE  ${sql.escape(`%${keyword}%`)} or g.group_name LIKE  ${sql.escape(`%${keyword}%`)})`;
      }

      query += ` LIMIT ${itemsPerPage} OFFSET ${skip}`;

      const groupAndSoloList = await this.entityManager.query(query);

      return {
        page: currentPage,
        size: itemsPerPage,
        groupAndSoloList,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createGroup(groupInfo: GroupCreateRequest): Promise<Group | null> {
    try {
      const insertGroup = await this.entityManager
        .getRepository(Group)
        .createQueryBuilder()
        .insert()
        .into(Group)
        .values([groupInfo])
        .execute();

      if (insertGroup.raw === 0) {
        throw new InternalServerErrorException();
      }

      const { id } = insertGroup.identifiers[0];

      const newGroup = await this.entityManager.getRepository(Group).findOneBy({
        id,
      });

      return newGroup;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
