import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';

@ApiTags('행사')
@Controller('/event')
export class EventController {
  constructor(private readonly evnetService: EventService) {}

  @Post()
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
