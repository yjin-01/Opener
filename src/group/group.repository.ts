import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GroupCreateRequest } from './dto/group.create.request';
import { Group } from './entity/group.entity';
import { GroupResponse } from './dto/group.response';

@Injectable()
export class GroupRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findAllGroup(): Promise<GroupResponse[]> {
    try {
      const groupList = await this.entityManager.getRepository(Group).find();

      return groupList;
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
