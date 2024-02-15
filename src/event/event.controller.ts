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
  NotFoundException,
  ConflictException,
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
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';
import { EventListRequest } from './swagger/event.list.request';
import { EventListQueryDto } from './dto/event.list.dto';
import { EventListByPageRespone } from './swagger/event.list.response';
import { EventListByPageResponseDto } from './dto/event.list.response.dto';
import { EventValidationPipe } from './event.validation.pipe';
import { Event } from './entity/event.entity';
import {
  EventListByPageResponseInterceptor,
  EventResponseInterceptor,
} from './interceptor/event.list.response.interceptor';
import { EventUpdateRequest } from './dto/event.update.request';
import { EventInternalServerResponse } from './swagger/event.servererror.response';
import { EventNotfoundResponse } from './swagger/event.notfound.response';
import { EventUpdateApprovalRequestDto } from './dto/event.update.approval.request.dto';
import { EventConflitResponse } from './swagger/event.conflict.response';
import { EventUpdateApplicationRequestDto } from './dto/event.update.application.request.dto';
import { EventUpdateApplication } from './entity/event.update.application.entity';
import { EventUpdateApplicationDetailDto } from './dto/event.update.application.detail.dto';
import { Tag } from './entity/tag.entity';
import { EventLikeStatusDto } from './dto/event.like-status.response.dto';
import { EventClaimDto } from './dto/event.claim.create.dto';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('행사')
@Controller('/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

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
      return await this.eventService.getEventList(getEventListDto);
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
      return await this.eventService.getEventListByUserArtist(
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
  @UseInterceptors(EventResponseInterceptor)
  @Get('/popularity')
  async getEventListByPopularity(): Promise<any> {
    try {
      return await this.eventService.getEventListByPopularity();
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
  @UseInterceptors(EventResponseInterceptor)
  @Get('/new')
  async getNewEventList(): Promise<Event[]> {
    try {
      return await this.eventService.getNewEventList();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @ApiOperation({
    summary: '특전 목록 조회',
    description: '특전 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'tags',
    description: '조회할 태그 IDs',
    example: '427ccba2-beb2-43,484f52cb-016f-48,5790e618-cb78-4d',
    required: false,
  })
  @ApiOkResponse({
    description: '특전 목록',
    type: [Tag],
  })
  @Get('/tag')
  async getTagList(@Query('tags') tags: string): Promise<Tag[] | null> {
    try {
      return await this.eventService.getTagList(tags);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @ApiOperation({
    summary: '좋아요 여부 및 좋아요 수 조회',
    description:
      '로그인한 유저의 행사 좋아요 여부 및 행사의 좋아요 수 확인 가능 비로그인 시 status = false 반환',
  })
  @ApiQuery({
    name: 'userId',
    description: '이벤트 ID',
    required: false,
  })
  @ApiQuery({
    name: 'eventId',
    description: '이벤트 ID',
  })
  @ApiOkResponse({
    description: '좋아요 상태 및 좋아요 수 반환',
    type: EventLikeStatusDto,
  })
  @Get('/like')
  async checkEventLikeByUser(
    @Query('eventId', new EventValidationPipe()) eventId: string,
      @Query('userId', new EventValidationPipe()) userId: string,
  ): Promise<EventLikeStatusDto> {
    try {
      return await this.eventService.checkLikeStatus(eventId, userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // V2
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
      example5: {
        description: '종료된 행사 제외',
        value: '종료제외',
      },
    },
  })
  @ApiOkResponse({
    description: '행사 목록 조회',
    type: [Event],
  })
  @UseInterceptors(EventResponseInterceptor)
  @Get(':userId/like')
  async getEventByUser(
    @Param('userId') userId: string,
      @Query('status') status: string,
  ): Promise<Event[]> {
    try {
      return await this.eventService.getEventByUserLike(userId, status);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // V1
  // @ApiBearerAuth('accessToken')
  // @ApiOperation({
  //   summary: '유저가 좋아요한 행사 목록 조회',
  //   description: '마이페이지',
  // })
  // @ApiParam({
  //   name: 'userId',
  //   description: '유저의 Id',
  // })
  // @ApiQuery({
  //   name: 'status',
  //   description: '이벤트 진행 상태에 대한 필터',
  //   required: false,
  //   examples: {
  //     example1: {
  //       description: '모든 이벤트 조회',
  //       value: '',
  //     },
  //     example2: {
  //       description: '예정된 이벤트 조회 시',
  //       value: '예정',
  //     },
  //     example3: {
  //       description: '진행중인 이벤트 조회 시',
  //       value: '진행중',
  //     },
  //     example4: {
  //       description: '종료된 이벤트 조회 시',
  //       value: '종료',
  //     },
  //   },
  // })
  // @ApiQuery({
  //   name: 'targetDate',
  //   description: '조회할 날짜',
  //   required: false,
  //   example: '2024-01-02',
  // })
  // @ApiQuery({
  //   name: 'cursorId',
  //   description: '커서 번호',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'size',
  //   description: '한 페이지당 갯수',
  //   required: false,
  // })
  // @ApiOkResponse({
  //   description: '행사 목록 조회',
  //   type: EventListByCursorRespone,
  // })
  // @UseInterceptors(EventListByCursorResponseInterceptor)
  // @Get(':userId/like')
  // async getEventByUser(
  //   @Param('userId') userId: string,
  //     @Query() requirement: EventUserLikeListQueryDto,
  // ): Promise<EventListByCursorRespone> {
  //   try {
  //     console.log('userId', userId);
  //     return await this.eventService.getEventByUserLike(userId, requirement);
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }

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
  @UseInterceptors(EventResponseInterceptor)
  @Get(':eventId')
  async getEventDetail(
    @Param('eventId') eventId: string,
  ): Promise<Event | null> {
    try {
      return await this.eventService.getEventDetail(eventId);
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
  @ApiInternalServerErrorResponse({
    description: '저장 실패한 경우',
    type: EventInternalServerResponse,
  })
  @Post()
  async createEvent(
    @Body(new EventValidationPipe()) eventCreateRequest: EventCreateRequest,
  ): Promise<EventCreateResponse | null> {
    try {
      return await this.eventService.createEvent(eventCreateRequest);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        console.error('error', error);
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  @Public()
  @ApiOperation({
    summary: '행사별 수정 신청 목록 조회',
    description: '행사 수정 신청 조회합니다.',
  })
  @ApiParam({
    name: 'eventId',
    description: '조회할 행사의 ID',
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @ApiOkResponse({
    description: '행사 수정 신청 목록',
    type: [EventUpdateApplication],
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 이벤트 ID',
    type: EventNotfoundResponse,
  })
  @Get(':eventId/update/application')
  async getEventUpdateApplicationList(
    @Param('eventId') eventId: string,
  ): Promise<EventUpdateApplication[] | null> {
    try {
      return await this.eventService.getEventUpdateApplicationList(eventId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(error);
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @ApiOperation({
    summary: '행사 수정 신청 상세 조회',
    description: '행사 수정 신청 상세 조회합니다.',
  })
  @ApiParam({
    name: 'eventUpdateApplicationId',
    description: '조회할 행사 수정 신청의 ID',
    example: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
  @ApiOkResponse({
    description: '행사의 상세 내역',
    type: EventUpdateApplicationDetailDto,
  })
  @ApiNotFoundResponse({
    description:
      '존재하지 않는 행사 수정 신청의 ID 또는 존재하지 않는 이벤트 ID',
    type: EventNotfoundResponse,
  })
  @Get('/update/application/:eventUpdateApplicationId')
  async getEventUpdateApplicationDetail(
    @Param('eventUpdateApplicationId') eventUpdateApplicationId: string,
  ): Promise<EventUpdateApplicationDetailDto | null> {
    try {
      return await this.eventService.getEventUpdateApplicationDetail(
        eventUpdateApplicationId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(error);
        throw error;
      }
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
  @ApiBody({ type: EventUpdateRequest })
  @ApiOkResponse({
    description: '수정 등록된 행사에 대한 정보',
    type: Event,
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 event Id인 경우',
    type: EventNotfoundResponse,
  })
  @Put(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
      @Body(new EventValidationPipe()) eventUpdateRequest: EventUpdateRequest,
  ): Promise<Event | null> {
    try {
      return await this.eventService.updateEvent(eventId, eventUpdateRequest);
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(error);
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '행사 수정 신청',
    description: ' 행사 수정 신청 API.',
  })
  @ApiBody({ type: EventUpdateApplicationRequestDto })
  @ApiOkResponse({
    description: '수정 등록된 행사에 대한 정보',
    type: String,
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 event Id인 경우',
    type: EventNotfoundResponse,
  })
  @Post('/update/application')
  async createEventUpdateApplication(
    @Body(new EventValidationPipe())
      eventUpdateApplicationRequestDto: EventUpdateApplicationRequestDto,
  ): Promise<String> {
    try {
      return await this.eventService.createEventUpdateApplication(
        eventUpdateApplicationRequestDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(error);
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '행사 수정 신청 승인 및 거절',
    description: ' 행사 수정 신청 승인 및 거절 API.',
  })
  @ApiBody({
    type: EventUpdateApprovalRequestDto,
  })
  @ApiOkResponse({
    description: '행사 수정 신청 내역',
    type: EventUpdateApplication,
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 이벤트 수정 신청Id인 경우',
    type: EventNotfoundResponse,
  })
  @ApiConflictResponse({
    description: '이미 승인 및 거절한 경우 또는 이미 반영된 수정 신청인 경우',
    type: EventConflitResponse,
  })
  @Post('/update/approval')
  async approveEventUpdate(
    @Body(new EventValidationPipe())
      eventUpdateApprovalRequestDto: EventUpdateApprovalRequestDto,
  ): Promise<EventUpdateApplication | null> {
    try {
      return await this.eventService.approveEventUpdate(
        eventUpdateApprovalRequestDto,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error(error);
        throw error;
      }

      if (error instanceof NotFoundException) {
        console.error(error);
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException();
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
      return await this.eventService.toggleEventLike({ eventId, userId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/claim')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '이벤트 신고',
    description: '이벤트 신고',
  })
  @ApiBody({ type: EventClaimDto })
  @ApiCreatedResponse({
    description: '이벤트 신고 Id',
  })
  @ApiBadRequestResponse({
    description: 'request가 잘못되었을 때 반환',
  })
  @ApiNotFoundResponse({
    description: '유저 또는 이벤트가 존재하지 않은 경우',
  })
  async createEvnetClaim(
    @Body(new EventValidationPipe()) eventClaimDto: EventClaimDto,
  ): Promise<String | null> {
    try {
      return await this.eventService.createEventClaim(eventClaimDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.error(error);
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
