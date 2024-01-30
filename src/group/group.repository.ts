import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GroupCreateRequest } from './dto/group.create.request';
import { Group } from './entity/group.entity';
import { GroupResponse } from './dto/group.response';
import { GroupListResponse } from './dto/group.list.response';

@Injectable()
export class GroupRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findAllGroup(
    keyword: string,
    page: number,
    size: number,
  ): Promise<GroupListResponse | null> {
    try {
      const itemsPerPage = size || 12; // 페이지당 아이템 수
      const currentPage = page || 1; // 현재 페이지

      const skip = (currentPage - 1) * itemsPerPage;

      const query = this.entityManager
        .getRepository(Group)
        .createQueryBuilder('group')
        .where('1=1');

      if (keyword) {
        query.andWhere('group.group_name LIKE :groupName', {
          groupName: `%${keyword}%`,
        });
      }

      query.select(['group.group_id', 'group.group_name', 'group.group_image']);

      const totalCount = await query.getCount();

      query.orderBy('group.group_name', 'ASC').offset(skip).limit(itemsPerPage);

      const groupList = await query.getRawMany();

      return {
        totalCount, page: currentPage, size: itemsPerPage, groupList,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createGroup(
    groupInfo: GroupCreateRequest,
  ): Promise<GroupResponse | null> {
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

      const groupId = insertGroup.identifiers[0].groupId.slice(0, 16);

      const newGroup = await this.entityManager.getRepository(Group).findOneBy({
        groupId,
      });

      return newGroup;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
