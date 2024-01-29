import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { GroupCreateRequest } from './dto/group.create.request';
import { GroupService } from './group.service';
import { GroupResponse } from './dto/group.response';

@ApiTags('그룹&아티스트')
@Controller('/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @ApiOperation({
    summary: '그룹 목록 조회',
    description: '그룹 목록을 조회 가능합니다.',
  })
  @ApiCreatedResponse({
    description: '등록되어있는 그룹 목록 조회',
    type: [GroupResponse],
  })
  async getGroupList(): Promise<GroupResponse[] | null> {
    try {
      return await this.groupService.getGroupList();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @ApiOperation({
    summary: '그룹 등록',
    description: '새로운 그룹을 등록합니다.',
  })
  @ApiBody({ type: GroupCreateRequest })
  @ApiCreatedResponse({
    description: '정상 등록된 그룹에 대한 정보',
    type: GroupResponse,
  })
  async createGroup(
    @Body() groupCreateDto: GroupCreateRequest,
  ): Promise<GroupResponse | null> {
    try {
      return await this.groupService.createGroup(groupCreateDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
