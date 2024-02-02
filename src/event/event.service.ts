import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getEventList({ getEventListDto }) {
    const eventIdList: object[] = [];

    let { tags } = getEventListDto;

    const { keyword } = getEventListDto;

    if (tags) {
      tags = tags.split(',');
      const serchTags = await this.eventRepository.findEventTagByTagId({
        tags,
      });

      serchTags.forEach((el) => {
        eventIdList.push(el.eventId);
      });
    }

    if (keyword) {
      const searchKeyword = await this.eventRepository.findEventTargetByKeyword(
        { keyword },
      );

      searchKeyword.forEach((el) => {
        eventIdList.push(el.eventId);
      });
    }

    // 검색 조건이 있는 해당하는 event가 없는 경우
    if (((tags && tags.length !== 0) || keyword) && eventIdList.length === 0) {
      return [];
    }

    // 이벤트 조회
    const eventList = await this.eventRepository.findAllEvent({
      getEventListDto,
      eventIdList,
    });

    console.log('eventList', eventList);
    if (eventList.length === 0) {
      return [];
    }

    const targetEventIds = eventList.map((el) => el.eventId);

    console.log('targetEventIds', targetEventIds);

    // 이벤트에 참여하는 아티스트 조회
    const artistList = await this.eventRepository.findEventTargetByEventId({
      targetEventIds,
    });
    console.log('artistList', artistList);
    eventList.forEach((event) => {
      const targetArtists: object[] = [];
      artistList.forEach((artist) => {
        if (event.eventId === artist.eventId) {
          targetArtists.push(artist);
        }
      });
      Object.assign(event, { targetArtists });
      // event.targetArtists = targetArtists;
    });

    // 이벤트에 해당하는 태그(특전) 조회
    const tagList = await this.eventRepository.findEventTagByEventId({
      targetEventIds,
    });

    console.log('tagList', tagList);
    eventList.forEach((event) => {
      const targetTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.eventId === tag.eventId) {
          targetTags.push(tag);
        }
      });
      Object.assign(event, { teventTags: targetTags });
    });

    return {
      eventList,
      page: Number(getEventListDto.page),
      size: Number(getEventListDto.size),
    };
  }

  async getEventDetail({ eventId }) {
    const event = await this.eventRepository.findOneByEventId({ eventId });

    if (!event) {
      return {};
    }

    const targetEventIds = [eventId];

    // 이벤트에 참여하는 아티스트 조회
    const artistList = await this.eventRepository.findEventTargetByEventId({
      targetEventIds,
    });

    // 이벤트에 해당하는 태그(특전) 조회
    const tagList = await this.eventRepository.findEventTagByEventId({
      targetEventIds,
    });

    event.targetArtists = artistList;

    event.eventTags = tagList;

    return event;
  }

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
