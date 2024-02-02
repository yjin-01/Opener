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
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';
import { EventListRequest } from './swagger/event.geteventlist.request';
import { EventGetListDto } from './dto/event.getlist.dto';
import { EventResponse } from './swagger/getevent.response';
import { EventGetListRespone } from './swagger/event.eventlist.response';

@ApiTags('행사')
@Controller('/event')
export class EventController {
  constructor(private readonly evnetService: EventService) {}

  @Get()
  @ApiBearerAuth('accessToken')
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
    type: [EventGetListRespone],
  })
  async getEventList(
    @Query() getEventListDto: EventGetListDto,
  ): Promise<any | null> {
    try {
      return await this.evnetService.getEventList({ getEventListDto });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':eventId')
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
    type: [EventResponse],
  })
  async getEventDetail(@Param('eventId') eventId: string): Promise<any | null> {
    try {
      return await this.evnetService.getEventDetail({ eventId });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
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
}
