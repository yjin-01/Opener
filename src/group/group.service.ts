import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupResponse } from './dto/group.response';
import { GroupCreateRequest } from './dto/group.create.request';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroupList(keyword: string): Promise<GroupResponse[] | null> {
    try {
      const result = await this.groupRepository.findAllGroup(keyword);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createGroup(
    groupInfo: GroupCreateRequest,
  ): Promise<GroupResponse | null> {
    try {
      const result = await this.groupRepository.createGroup(groupInfo);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
