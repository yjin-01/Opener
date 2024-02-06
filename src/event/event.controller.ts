import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Query,
  Param,
  SetMetadata,
  UseInterceptors,
  Put,
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
import {
  EventListByCursorRespone,
  EventListByPageRespone,
} from './swagger/event.list.response';
import { EventUserLikeListQueryDto } from './dto/event.user-like.list.dto';
import { EventListByPageResponseDto } from './dto/event.list.response.dto';
import { EventValidationPipe } from './event.validation.pipe';
import { Event } from './entity/event.entity';
import {
  EventListByCursorResponseInterceptor,
  EventListByPageResponseInterceptor,
  EventListResponseInterceptor,
} from './interceptor/event.list.response.interceptor';
import { EventUpdateRequest } from './dto/event.update.request';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('행사')
@Controller('/event')
export class EventController {
  constructor(private readonly evnetService: EventService) {}

  @Public()
  @ApiOperation({
    summary: '행사 모든 목록 조회',
    description: '행사 모든 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'EventListRequest',
    type: [EventListRequest],
  })
  @ApiCreatedResponse({
    description: '등록된 행사 목록',
    type: EventListByPageRespone,
  })
  @UseInterceptors(EventListByPageResponseInterceptor)
  @Get()
  async getEventList(
    @Query() getEventListDto: EventListQueryDto,
  ): Promise<EventListByPageResponseDto> {
    try {
      return await this.evnetService.getEventList(getEventListDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // v2
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '유저가 좋아요한 아티스트들의 행사 목록 조회',
    description: '(메인페이지) 내 아티스트의 행사 / (전체 보기 페이지)',
  })
  @ApiParam({
    name: 'userId',
    description: '유저 Id',
  })
  @ApiQuery({
    name: 'page',
    description: '페이지',
    required: false,
  })
  @ApiQuery({
    name: 'size',
    description: '데이터 수',
    required: false,
  })
  @ApiOkResponse({
    description: '유저가 좋아요한 아티스트들의 행사 목록',
    type: EventListByPageRespone,
  })
  @UseInterceptors(EventListByPageResponseInterceptor)
  @Get(':userId/artist')
  async getEventListByUserArtist(
    @Param('userId') userId: string,
      @Query('page') page: string,
      @Query('size') size: string,
  ): Promise<EventListByPageResponseDto> {
    try {
      console.log(userId, page, size);
      return await this.evnetService.getEventListByUserArtist(
        userId,
        page,
        size,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  //  V1
  // @ApiBearerAuth('accessToken')
  // @ApiOperation({
  //   summary: '유저가 좋아요한 아티스트들의 행사 목록 조회',
  //   description: '(메인페이지) 내 아티스트의 행사 / (전체 보기 페이지)',
  // })
  // @ApiParam({
  //   name: 'userId',
  //   description: '유저 Id',
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'EventListRequest',
  //   type: [EventListRequest],
  // })
  // @ApiCreatedResponse({
  //   description: '유저가 좋아요한 아티스트들의 행사 목록',
  //   type: EventListByPageRespone,
  // })
  // @UseInterceptors(EventListByPageResponseInterceptor)
  // @Get(':userId/artist')
  // async getEventListByUserArtist(
  //   @Param('userId') userId: string,
  //   @Query() getEventListDto: EventListQueryDto,
  // ): Promise<EventListByPageResponseDto> {
  //   try {
  //     return await this.evnetService.getEventListByUserArtist(
  //       userId,
  //       getEventListDto,
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  @Public()
  @ApiOperation({
    summary: '인기 TOP 10',
    description: '(메인페이지) 가장 인기있는 행사',
  })
  @ApiOkResponse({
    description: '가장 인기있는 행사 목록',
    type: [Event],
  })
  @UseInterceptors(EventListResponseInterceptor)
  @Get('/popularity')
  async getEventListByPopularity(): Promise<any> {
    try {
      return await this.evnetService.getEventListByPopularity();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @ApiOperation({
    summary: '최신 등록',
    description: '(메인페이지) 새로 올라온 행사(일주일)',
  })
  @ApiOkResponse({
    description: '새로 올라온 행사 목록',
    type: [Event],
  })
  @UseInterceptors(EventListResponseInterceptor)
  @Get('/new')
  async getNewEventList(): Promise<Event[]> {
    try {
      return await this.evnetService.getNewEventList();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @ApiOperation({
    summary: '행사 상세 조회',
    description: '행사 상세를 조회합니다.',
  })
  @ApiParam({
    name: 'eventId',
    description: '조회할 이벤트의 ID',
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @ApiOkResponse({
    description: '행사의 상세 내역',
    type: Event,
  })
  @Get(':eventId')
  async getEventDetail(
    @Param('eventId') eventId: string,
  ): Promise<Event | null> {
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
    description: '마이페이지',
  })
  @ApiParam({
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
    name: 'targetDate',
    description: '조회할 날짜',
    required: false,
    example: '2024-01-02',
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
    type: EventListByCursorRespone,
  })
  @UseInterceptors(EventListByCursorResponseInterceptor)
  @Get(':userId/like')
  async getEventByUser(
    @Param('userId') userId: string,
      @Query() requirement: EventUserLikeListQueryDto,
  ): Promise<EventListByCursorRespone> {
    try {
      return await this.evnetService.getEventByUserLike(userId, requirement);
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
  @ApiOkResponse({
    description: '정상 등록된 행사에 대한 정보',
    type: EventCreateResponse,
  })
  @Post()
  async createEvent(
    @Body(new EventValidationPipe()) eventCreateRequest: EventCreateRequest,
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
    summary: '행사 수정',
    description: ' 행사 수정 API.',
  })
  @ApiParam({
    name: 'eventId',
    description: '이벤트의 Id',
  })
  @ApiBody({ type: EventCreateRequest })
  @ApiOkResponse({
    description: '수정 등록된 행사에 대한 정보',
    type: Event,
  })
  @Put(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
      @Body(new EventValidationPipe()) eventUpdateRequest: EventUpdateRequest,
  ): Promise<Event | null> {
    try {
      return await this.evnetService.updateEvent(eventId, eventUpdateRequest);
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
    @Body('eventId', new EventValidationPipe()) eventId: string,
      @Body('userId', new EventValidationPipe()) userId: string,
  ): Promise<boolean> {
    try {
      return await this.evnetService.toggleEventLike({ eventId, userId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
