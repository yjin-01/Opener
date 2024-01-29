import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(
    eventInfo: EventCreateRequest,
  ): Promise<EventCreateResponse | null> {
    try {
      const result = await this.eventRepository.createEvent(eventInfo);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
