import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';
import { EventUserLikeListQueryDto } from './dto/event.user-like.list.dto';
import { EventListResponseDto } from './dto/event.list.response.dto';

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

    if (eventList.length === 0) {
      return [];
    }

    const targetEventIds = eventList.map((el) => el.eventId);

    // 이벤트에 참여하는 아티스트 조회
    const artistList = await this.eventRepository.findEventTargetByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const targetArtists: object[] = [];
      artistList.forEach((artist) => {
        if (event.eventId === artist.eventId) {
          targetArtists.push(artist);
        }
      });
      Object.assign(event, { targetArtists });
    });

    // 이벤트에 해당하는 태그(특전) 조회
    const tagList = await this.eventRepository.findEventTagByEventId({
      targetEventIds,
    });

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

  async getEventByUser(
    requirement: EventUserLikeListQueryDto,
  ): Promise<EventListResponseDto> {
    const eventList = await this.eventRepository.findEventLikgeByUserId(requirement);

    if (eventList.length === 0) {
      return { cursorId: null, size: Number(requirement.size), eventList: [] };
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트에 참여하는 아티스트 조회
    const artistList = await this.eventRepository.findEventTargetByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const targetArtists: object[] = [];
      artistList.forEach((artist) => {
        if (event.id === artist.eventId) {
          targetArtists.push(artist);
        }
      });
      Object.assign(event, { targetArtists });
    });

    // 이벤트에 해당하는 태그(특전) 조회
    const tagList = await this.eventRepository.findEventTagByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const targetTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          targetTags.push(tag);
        }
      });
      Object.assign(event, { eventTags: targetTags });
    });

    // 페이지네이션
    const hasNextData = eventList.length === requirement.size;
    let cursorId: number | null;

    console.log(hasNextData, eventList.length, requirement.size);
    if (hasNextData) {
      cursorId = eventList[eventList.length - 1].sequence;
    } else {
      cursorId = null;
    }

    return { cursorId, size: Number(requirement.size), eventList };
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

  async toggleEventLike({ eventId, userId }): Promise<boolean> {
    try {
      const result = await this.eventRepository.likeToggle({ eventId, userId });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
