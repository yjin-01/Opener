import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupCreateRequest } from './dto/group.create.request';
import { GroupListResponse } from './dto/group.list.response';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroupAndSoloList({
    keyword,
    page,
    size,
  }): Promise<GroupListResponse | null> {
    try {
      const result = await this.groupRepository.findAllGroupAndSolo({
        keyword,
        page,
        size,
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getGrouptByGroupId(groupId: string): Promise<Group | null> {
    try {
      const result = await this.groupRepository.findGroupByGroupId(groupId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createGroup(groupInfo: GroupCreateRequest): Promise<Group | null> {
    try {
      const result = await this.groupRepository.createGroup(groupInfo);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
