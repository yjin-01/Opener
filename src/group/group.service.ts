import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupResponse } from './dto/group.response';
import { GroupCreateRequest } from './dto/group.create.request';
import { GroupListResponse } from './dto/group.list.response';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getGroupList(
    keyword: string,
    page: number,
    size: number,
  ): Promise<GroupListResponse | null> {
    try {
      const result = await this.groupRepository.findAllGroup(
        keyword,
        page,
        size,
      );
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
