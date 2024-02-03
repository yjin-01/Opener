import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';
import { EventListRequest } from './swagger/event.list.request';
import { EventListQueryDto } from './dto/event.list.dto';
import { EventResponse } from './swagger/event.detail.response';
import { EventGetListRespone } from './swagger/event.list.response';
import { EventUserLikeListQueryDto } from './dto/event.user-like.list.dto';
import { EventListResponseDto } from './dto/event.list.response.dto';

@ApiTags('행사')
@Controller('/event')
export class EventController {
  constructor(private readonly evnetService: EventService) {}

  @ApiOperation({
    summary: '행사 목록 조회',
    description: '행사 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'EventListRequest',
    type: [EventListRequest],
  })
  @ApiCreatedResponse({
    description: '등록된 행사 목록',
    type: EventGetListRespone,
  })
  @Get()
  async getEventList(
    @Query() getEventListDto: EventListQueryDto,
  ): Promise<any | null> {
    try {
      return await this.evnetService.getEventList({ getEventListDto });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '행사 상세 조회',
    description: '행사 상세를 조회합니다.',
  })
  @ApiParam({
    name: 'eventId',
    description: '조회할 이벤트의 ID',
    type: String,
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @ApiCreatedResponse({
    description: '행사의 상세 내역',
    type: EventResponse,
  })
  @Get(':eventId')
  async getEventDetail(@Param('eventId') eventId: string): Promise<any | null> {
    try {
      return await this.evnetService.getEventDetail({ eventId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '유저가 좋아요한 행사 목록 조회',
    description: '',
  })
  @ApiQuery({
    name: 'userId',
    description: '유저의 Id',
  })
  @ApiQuery({
    name: 'status',
    description: '이벤트 진행 상태에 대한 필터',
    required: false,
    examples: {
      example1: {
        description: '모든 이벤트 조회',
        value: '',
      },
      example2: {
        description: '예정된 이벤트 조회 시',
        value: '예정',
      },
      example3: {
        description: '진행중인 이벤트 조회 시',
        value: '진행중',
      },
      example4: {
        description: '종료된 이벤트 조회 시',
        value: '종료',
      },
    },
  })
  @ApiQuery({
    name: 'cursorId',
    description: '커서 번호',
    required: false,
  })
  @ApiQuery({
    name: 'size',
    description: '한 페이지당 갯수',
    required: false,
  })
  @ApiOkResponse({
    description: '행사 목록 조회',
    type: EventResponse,
  })
  @Get('/user/like')
  async getEventByUser(
    @Query() requirement: EventUserLikeListQueryDto,
  ): Promise<EventListResponseDto> {
    try {
      return await this.evnetService.getEventByUser(requirement);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '행사 등록',
    description: '새로운 행사 정보를 등록합니다.',
  })
  @ApiBody({ type: EventCreateRequest })
  @ApiCreatedResponse({
    description: '정상 등록된 행사에 대한 정보',
    type: EventCreateResponse,
  })
  @Post()
  async createEvent(
    @Body() eventCreateRequest: EventCreateRequest,
  ): Promise<EventCreateResponse | null> {
    try {
      return await this.evnetService.createEvent(eventCreateRequest);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '행사 좋아요',
    description:
      '유저가 행사를 좋아요 또는 이미 좋아요한 행사인 경우 취소할 수 있음',
  })
  @ApiBody({
    schema: {
      properties: {
        userId: {
          type: 'string',
          example: '5e71c964-3e82-40a7-8ae4-16354888a7f4',
        },
        eventId: {
          type: 'string',
          example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '좋아요 시 true, 취소 시 false',
    type: Boolean,
  })
  @Post('/like')
  async toggleEventLike(
    @Body('eventId') eventId: string,
      @Body('userId') userId: string,
  ): Promise<boolean> {
    try {
      return await this.evnetService.toggleEventLike({ eventId, userId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
