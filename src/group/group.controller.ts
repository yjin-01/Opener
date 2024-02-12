import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
  UseInterceptors,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GroupCreateRequest } from './dto/group.create.request';
import { GroupService } from './group.service';
import { GroupResponse } from './swagger/group.response';
import { GroupListResponse } from './dto/group.list.response';
import { Group } from './entity/group.entity';
import { GroupCreateResponseInterceptor } from './interceptor/group.create.response.interceptor';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('그룹&아티스트')
@Controller('/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Public()
  @Get('/solo')
  @ApiOperation({
    summary: '그룹 + 솔로 목록 조회',
    description: '그룹 + 솔로 목록을 조회 가능합니다. [그룹명으로 검색 가능]',
  })
  @ApiQuery({
    name: 'keyword',
    description: '검색할 그룹명 또는 솔로명',
    type: String,
    example: 'test',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: '페이지',
    type: Number,
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'size',
    description: '데이터 개수',
    type: Number,
    example: 12,
    required: false,
  })
  @ApiOkResponse({
    description: '등록되어있는 그룹+솔로 목록 조회',
    type: [GroupListResponse],
  })
  async getGroupAndSoloList(
    @Query('keyword') keyword: string,
      @Query('page', ParseIntPipe) page: number,
      @Query('size', ParseIntPipe) size: number,
  ): Promise<GroupListResponse | null> {
    try {
      return await this.groupService.getGroupAndSoloList({
        keyword,
        page,
        size,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: '그룹 Id를 이용한 아티스트 조회',
    description: '그룹 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'groupId',
    description: '조회할 그룹의 ID',
    type: String,
    example: '313bbd45-8207-4836-8377-7f1fa173339d',
  })
  @ApiOkResponse({
    description: '아티스트 목록',
    type: Group,
  })
  async getGrouptByGroupId(
    @Query('groupId') groupId: string,
  ): Promise<Group | null> {
    try {
      return await this.groupService.getGrouptByGroupId(groupId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.error(error);
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @UseInterceptors(GroupCreateResponseInterceptor)
  @Post()
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹 등록',
    description: '새로운 그룹을 등록합니다.',
  })
  @ApiBody({ type: GroupCreateRequest })
  @ApiOkResponse({
    description: '정상 등록된 그룹에 대한 정보',
    type: GroupResponse,
  })
  async createGroup(
    @Body() groupCreateDto: GroupCreateRequest,
  ): Promise<Group | null> {
    try {
      return await this.groupService.createGroup(groupCreateDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
