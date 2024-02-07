import { Injectable } from '@nestjs/common';
import { ArtistRepository } from 'src/artist/artist.repository';
import { EventRepository } from './event.repository';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';
import { EventUserLikeListQueryDto } from './dto/event.user-like.list.dto';
import {
  EventListByCursorRespone,
  EventListByPageResponseDto,
} from './dto/event.list.response.dto';
import { EventListQueryDto } from './dto/event.list.dto';
import { EventUpdateRequest } from './dto/event.update.request';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async getEventList(
    getEventListDto: EventListQueryDto,
  ): Promise<EventListByPageResponseDto> {
    let eventIdList: object[] = [];
    let serchTags: any[] = [];
    let searchKeyword: any[] = [];

    const { tags, keyword } = getEventListDto;

    if (tags) {
      const tagIdList = tags.split(',');
      serchTags = await this.eventRepository.findEventTagByTagId({
        tags: tagIdList,
      });

      serchTags.forEach((el) => {
        eventIdList.push(el.eventId);
      });
    }

    if (keyword) {
      searchKeyword = await this.eventRepository.findEventTargetByKeyword({
        keyword,
      });

      searchKeyword.forEach((el) => {
        eventIdList.push(el.eventId);
      });
    }

    // 공통된 eventId만 넣기
    if (tags && keyword) {
      eventIdList = serchTags.filter((it) => searchKeyword.includes(it));
    }

    // 검색 조건이 있지만 해당하는 event가 없는 경우
    if (((tags && tags.length !== 0) || keyword) && eventIdList.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: getEventListDto.page ? Number(getEventListDto.page) : 1,
        size: getEventListDto.size ? Number(getEventListDto.size) : 12,
      };
    }

    // 이벤트 조회
    const {
      totalCount, page, size, eventList,
    } = await this.eventRepository.findAllEvent({
      getEventListDto,
      eventIdList,
    });

    if (eventList.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: Number(page),
        size: Number(size),
      };
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트 이미지 조회
    const imageList = await this.eventRepository.findEventImageByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const eventImages: object[] = [];
      imageList.forEach((image) => {
        if (event.id === image.eventId) {
          eventImages.push(image);
        }
      });
      Object.assign(event, { eventImages });
    });

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
      const eventTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          eventTags.push(tag);
        }
      });
      Object.assign(event, { eventTags });
    });

    // 커서 기반 페이지네이션 보류
    // const hasNextData = eventList.length === Number(getEventListDto.size);
    // let cursorId: number | null;

    // if (hasNextData) {
    //   cursorId = eventList[eventList.length - 1].sequence;
    // } else {
    //   cursorId = null;
    // }

    const result = {
      eventList,
      totalCount,
      page: Number(page),
      size: Number(size),
    };

    return result;
  }

  async getEventListByUserArtist(
    userId: string,
    page: string,
    size: string,
  ): Promise<EventListByPageResponseDto> {
    // 유저가 북마크한 아티스트 조회
    const userArtistList = await this.artistRepository.findArtistByUserId(userId);

    const userArtistIds = userArtistList.map((el) => el.artistId);

    // 이벤트 조회
    const { totalCount, eventList } = await this.eventRepository.findEventByUserArtist({
      userArtistIds,
      page,
      size,
    });

    if (eventList.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: page ? Number(page) : 1,
        size: size ? Number(size) : 12,
      };
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트 이미지 조회
    const imageList = await this.eventRepository.findEventImageByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const eventImages: object[] = [];
      imageList.forEach((image) => {
        if (event.id === image.eventId) {
          eventImages.push(image);
        }
      });
      Object.assign(event, { eventImages });
    });

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
      const eventTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          eventTags.push(tag);
        }
      });
      Object.assign(event, { eventTags });
    });

    const result = {
      eventList,
      totalCount,
      page: page ? Number(page) : 1,
      size: size ? Number(size) : 12,
    };

    return result;
  }

  async getEventListByUserArtistv1(
    userId: string,
    getEventListDto: EventListQueryDto,
  ): Promise<EventListByPageResponseDto> {
    // 유저가 북마크한 아티스트 조회
    const userArtistList = await this.artistRepository.findArtistByUserId(userId);

    const userArtistIds = userArtistList.map((el) => el.artistId);

    let eventIdList: object[] = [];
    let serchTags: any[] = [];
    let searchKeyword: any[] = [];

    const { tags, keyword } = getEventListDto;

    if (tags) {
      const tagIdList = tags.split(',');
      serchTags = await this.eventRepository.findEventTagByTagId({
        tags: tagIdList,
      });

      serchTags.forEach((el) => {
        eventIdList.push(el.eventId);
      });
    }

    if (keyword) {
      searchKeyword = await this.eventRepository.findEventTargetByKeyword({
        keyword,
      });

      searchKeyword.forEach((el) => {
        eventIdList.push(el.eventId);
      });
    }

    // 공통된 eventId만 넣기
    if (tags && keyword) {
      eventIdList = serchTags.filter((it) => searchKeyword.includes(it));
    }

    // 검색 조건이 있지만 해당하는 event가 없는 경우
    if (((tags && tags.length !== 0) || keyword) && eventIdList.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: Number(getEventListDto.page),
        size: Number(getEventListDto.size),
      };
    }

    // 이벤트 조회
    const {
      totalCount, page, size, eventList,
    } = await this.eventRepository.findEventByUserArtistv1({
      getEventListDto,
      eventIdList,
      userArtistIds,
    });

    if (eventList.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: Number(page),
        size: Number(size),
      };
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트 이미지 조회
    const imageList = await this.eventRepository.findEventImageByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const eventImages: object[] = [];
      imageList.forEach((image) => {
        if (event.id === image.eventId) {
          eventImages.push(image);
        }
      });
      Object.assign(event, { eventImages });
    });

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
      const eventTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          eventTags.push(tag);
        }
      });
      Object.assign(event, { eventTags });
    });

    const result = {
      eventList,
      totalCount,
      page: Number(page),
      size: Number(size),
    };

    return result;
  }

  // 인기 top10
  async getEventListByPopularity(): Promise<any> {
    // 이벤트 조회
    const eventList = await this.eventRepository.findEventByPopularity();

    if (eventList.length === 0) {
      return [];
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트 이미지 조회
    const imageList = await this.eventRepository.findEventImageByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const eventImages: object[] = [];
      imageList.forEach((image) => {
        if (event.id === image.eventId) {
          eventImages.push(image);
        }
      });
      Object.assign(event, { eventImages });
    });

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
      const eventTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          eventTags.push(tag);
        }
      });
      Object.assign(event, { eventTags });
    });

    return eventList;
  }

  // 새로 올라온 행사
  async getNewEventList(): Promise<any> {
    // 이벤트 조회
    const eventList = await this.eventRepository.findNewEventList();

    if (eventList.length === 0) {
      return [];
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트 이미지 조회
    const imageList = await this.eventRepository.findEventImageByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const eventImages: object[] = [];
      imageList.forEach((image) => {
        if (event.id === image.eventId) {
          eventImages.push(image);
        }
      });
      Object.assign(event, { eventImages });
    });

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
      const eventTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          eventTags.push(tag);
        }
      });
      Object.assign(event, { eventTags });
    });

    return eventList;
  }

  async getEventDetail({ eventId }) {
    const event = await this.eventRepository.findOneEventByEventId(eventId);

    if (!event) {
      return null;
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

  async getEventByUserLike(
    userId,
    requirement: EventUserLikeListQueryDto,
  ): Promise<EventListByCursorRespone> {
    const eventList = await this.eventRepository.findEventLikeByUserId(
      userId,
      requirement,
    );

    if (eventList.length === 0) {
      return { cursorId: null, size: requirement.size, eventList: [] };
    }

    const targetEventIds = eventList.map((el) => el.id);

    // 이벤트 이미지 조회
    const imageList = await this.eventRepository.findEventImageByEventId({
      targetEventIds,
    });

    eventList.forEach((event) => {
      const eventImages: object[] = [];
      imageList.forEach((image) => {
        if (event.id === image.eventId) {
          eventImages.push(image);
        }
      });
      Object.assign(event, { eventImages });
    });

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
      const eventTags: object[] = [];
      tagList.forEach((tag) => {
        if (event.id === tag.eventId) {
          eventTags.push(tag);
        }
      });
      Object.assign(event, { eventTags });
    });

    // 페이지네이션
    const hasNextData = eventList.length === Number(requirement.size);
    let cursorId: BigInt | null;

    if (hasNextData) {
      cursorId = eventList[eventList.length - 1].sequence;
    } else {
      cursorId = null;
    }

    return { cursorId, size: requirement.size, eventList };
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

  async updateEvent(eventId: string, eventUpdateRequest: EventUpdateRequest) {
    try {
      const event = await this.eventRepository.updateEvent(
        eventId,
        eventUpdateRequest,
      );

      if (!event) {
        return null;
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
