import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/user/interface/user.repository';
import { EventRepository } from './event.repository';
import { EventCreateRequest } from './dto/event.create.request';
import { EventCreateResponse } from './dto/event.create.response';
import { EventListByPageResponseDto } from './dto/event.list.response.dto';
import { EventListQueryDto } from './dto/event.list.dto';
import { EventUpdateRequest } from './dto/event.update.request';
import { EventUpdateApprovalRequestDto } from './dto/event.update.approval.request.dto';
import { EventUpdateApplicationRequestDto } from './dto/event.update.application.request.dto';
import { EventUpdateApplication } from './entity/event.update.application.entity';
import { EventUpdateApplicationDetailDto } from './dto/event.update.application.detail.dto';
import { Tag } from './entity/tag.entity';
import { Event } from './entity/event.entity';
import { EventLikeStatusDto } from './dto/event.like-status.response.dto';
import { EventClaimDto } from './dto/event.claim.create.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly artistRepository: ArtistRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  // 모든 행사 조회(isLike포함)
  async getEventList(
    getEventListDto: EventListQueryDto,
  ): Promise<EventListByPageResponseDto> {
    let eventIdList: object[] = [];
    let serchTags: any[] = [];
    let searchKeyword: any[] = [];

    const { tags, keyword, userId } = getEventListDto;

    if (tags) {
      const tagIdList = tags.split(',');
      serchTags = await this.eventRepository.findEventTagByTagId(tagIdList);

      eventIdList.push(serchTags);
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
      searchKeyword = searchKeyword.map((el) => el.eventId);

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

    if (userId) {
      const LikeList = await this.eventRepository.findEventLikeByUserId(userId);

      eventList.forEach((event) => {
        Object.assign(event, { isLike: false });
        LikeList.forEach((like) => {
          if (event.id === like.id) {
            Object.assign(event, { isLike: true });
          }
        });
      });
    }

    const result = {
      eventList,
      totalCount,
      page: Number(page),
      size: Number(size),
    };

    return result;
  }

  // 유저가 좋아요한 아티스트 목록 조회
  async getEventListByUserArtist(
    userId: string,
    page: string,
    size: string,
    sort: string,
  ): Promise<EventListByPageResponseDto> {
    const eventIdList: object[] = [];

    // 유저가 북마크한 아티스트 조회
    const userArtistList = await this.artistRepository.findArtistByUserId(userId);

    if (userArtistList.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: page ? Number(page) : 1,
        size: size ? Number(size) : 12,
      };
    }
    const userArtistIds = userArtistList.map((el) => {
      if (el.artistId) {
        return el.artistId;
      }
      return el.groupId;
    });

    const targetEvent = await this.eventRepository.findEventTargetByTargetId({
      userArtistIds,
    });

    if (targetEvent.length === 0) {
      return {
        eventList: [],
        totalCount: 0,
        page: page ? Number(page) : 1,
        size: size ? Number(size) : 12,
      };
    }

    targetEvent.forEach((el) => {
      eventIdList.push(el.eventId);
    });

    // 이벤트 조회
    const { totalCount, eventList } = await this.eventRepository.findEventByUserArtist(
      eventIdList,
      page,
      size,
      sort,
    );

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

    if (userId) {
      const LikeList = await this.eventRepository.findEventLikeByUserId(userId);

      eventList.forEach((event) => {
        Object.assign(event, { isLike: false });
        LikeList.forEach((like) => {
          if (event.id === like.id) {
            Object.assign(event, { isLike: true });
          }
        });
      });
    }

    const result = {
      eventList,
      totalCount,
      page: page ? Number(page) : 1,
      size: size ? Number(size) : 12,
    };

    return result;
  }

  async getNewEventListByUserArtist(userId: string): Promise<Event[]> {
    const eventIdList: object[] = [];

    // 유저가 북마크한 아티스트 조회
    const userArtistList = await this.artistRepository.findArtistByUserId(userId);

    if (userArtistList.length === 0) {
      return [];
    }
    const userArtistIds = userArtistList.map((el) => {
      if (el.artistId) {
        return el.artistId;
      }
      return el.groupId;
    });

    const targetEvent = await this.eventRepository.findEventTargetByTargetId({
      userArtistIds,
    });

    if (targetEvent.length === 0) {
      return [];
    }

    targetEvent.forEach((el) => {
      eventIdList.push(el.eventId);
    });

    // 이벤트 조회
    const eventList = await this.eventRepository.findNewEventList(eventIdList);

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

    if (userId) {
      const LikeList = await this.eventRepository.findEventLikeByUserId(userId);

      eventList.forEach((event) => {
        Object.assign(event, { isLike: false });
        LikeList.forEach((like) => {
          if (event.id === like.id) {
            Object.assign(event, { isLike: true });
          }
        });
      });
    }

    return eventList;
  }

  // 인기 top10
  async getEventListByPopularity(userId: string): Promise<any> {
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

    if (userId) {
      const LikeList = await this.eventRepository.findEventLikeByUserId(userId);

      eventList.forEach((event) => {
        Object.assign(event, { isLike: false });
        LikeList.forEach((like) => {
          if (event.id === like.id) {
            Object.assign(event, { isLike: true });
          }
        });
      });
    }

    return eventList;
  }

  // 새로 올라온 행사
  async getNewEventList(userId: string): Promise<any> {
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

    if (userId) {
      const LikeList = await this.eventRepository.findEventLikeByUserId(userId);

      eventList.forEach((event) => {
        Object.assign(event, { isLike: false });
        LikeList.forEach((like) => {
          if (event.id === like.id) {
            Object.assign(event, { isLike: true });
          }
        });
      });
    }

    return eventList;
  }

  async getEventDetail(eventId: string, userId: string = '') {
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

    event.isLike = await this.eventRepository.checkLikeStatus({
      eventId,
      userId,
    });

    return event;
  }

  //  V2
  async getEventByUserLike(userId: string, status: string): Promise<Event[]> {
    const eventList = await this.eventRepository.findEventLikeByUserId(
      userId,
      status,
    );

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

    eventList.forEach((event) => {
      Object.assign(event, { isLike: true });
    });

    return eventList;
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

  async createEventUpdateApplication(
    eventUpdateApplicationRequestDto: EventUpdateApplicationRequestDto,
  ): Promise<Object> {
    try {
      const result = await this.eventRepository.createEventUpdateApplication(
        eventUpdateApplicationRequestDto,
      );
      return { result };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async approveEventUpdate(
    eventUpdateApprovalRequestDto: EventUpdateApprovalRequestDto,
  ): Promise<EventUpdateApplication | null> {
    try {
      const result = await this.eventRepository.approveEventUpdate(
        eventUpdateApprovalRequestDto,
      );

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getEventUpdateApplicationList(
    eventId: string,
  ): Promise<EventUpdateApplication[] | null> {
    try {
      const result = await this.eventRepository.findUpdateApplication(eventId);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getEventUpdateApplicationDetail(
    eventUpdateApplicationId: string,
  ): Promise<EventUpdateApplicationDetailDto | null> {
    try {
      const result = await this.eventRepository.findUpdateApplicationDetail(
        eventUpdateApplicationId,
      );

      if (!result) {
        return null;
      }

      console.log(result);

      const originEvent = await this.getEventDetail(result.eventId);

      if (!originEvent) throw new NotFoundException('Event not exist');

      return { applicationDetail: result, originEvent };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checkLikeStatus(
    eventId: string,
    userId: string,
  ): Promise<EventLikeStatusDto> {
    try {
      let status: boolean = false;

      if (userId) {
        status = await this.eventRepository.checkLikeStatus({
          eventId,
          userId,
        });
      }

      const likeCount = await this.eventRepository.findCountLike(eventId);

      return { status, likeCount };
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

  async getTagList(tags: string): Promise<Tag[] | null> {
    try {
      const tagIds = tags ? tags.split(',') : null;

      const result = await this.eventRepository.findTag(tagIds);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createEventClaim(eventClaimDto: EventClaimDto): Promise<String | null> {
    try {
      const user = this.userRepository.findById(eventClaimDto.userId);

      if (!user) {
        throw new NotFoundException('User not exist');
      }

      const result = await this.eventRepository.createEventClaim(eventClaimDto);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
