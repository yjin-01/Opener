import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Artist } from 'src/artist/entity/artist.entity';
import { Group } from 'src/group/entity/group.entity';
import * as moment from 'moment';
import { EventCreateRequest } from './dto/event.create.request';
import { Event } from './entity/event.entity';
import { EventTarget } from './entity/event.target.entity';
import { EventTag } from './entity/event.tag.entity';
import { EventImage } from './entity/event.image.entity';
import { EventCreateResponse } from './dto/event.create.response';
import { Tag } from './entity/tag.entity';
import { EventLike } from './entity/event.like.entity';
import { EventListByPageResponseDto } from './dto/event.list.response.dto';
import { EventUpdateRequest } from './dto/event.update.request';
import { EventUpdateApprovalRequestDto } from './dto/event.update.approval.request.dto';
import { EventUpdateApproval } from './entity/event.update.approval.entity';
import { EventUpdateApplicationRequestDto } from './dto/event.update.application.request.dto';
import { EventUpdateApplication } from './entity/event.update.application.entity';
import { EventClaimDto } from './dto/event.claim.create.dto';
import { EventClaim } from './entity/event.claim.entity';

@Injectable()
export class EventRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
  ) {}

  // 모든 이벤트 조회(커서기반 보류)
  async findAllEvent({
    getEventListDto,
    eventIdList,
  }): Promise<EventListByPageResponseDto> {
    try {
      const {
        sido, gungu, startDate, endDate, page, size, sort,
      } = getEventListDto;

      const itemsPerPage = Number(size) || 12; // 페이지당 아이템 수
      const currentPage = Number(page) || 1; // 현재 페이지

      const skip = (currentPage - 1) * itemsPerPage;

      const query = this.entityManager
        .getRepository(Event)
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.eventLikes', 'eventLikes')
        .select([
          'e.id AS id',
          'e.sequence AS sequence',
          'e.placeName AS placeName',
          'e.description AS description',
          'e.eventType AS eventType ',
          'e.startDate AS startDate',
          'e.endDate AS endDate',
          'e.eventUrl AS eventUrl',
          'e.organizerSns AS organizerSns',
          'e.snsType AS snsType',
          'e.address AS address',
          'e.addressDetail AS addressDetail',
          'e.createdAt AS createdAt',
        ])
        .addSelect(['COUNT(eventLikes.id) AS likeCount'])
        .where('1=1');

      if (eventIdList.length !== 0) {
        query.andWhere('e.id IN (:...eventIdList)', { eventIdList });
      }

      if (sido) {
        query.andWhere('e.address LIKE :sido', { sido: `%${sido}%` });
      }

      if (gungu) {
        query.andWhere('e.address LIKE :gungu', { gungu: `%${gungu}%` });
      }

      if (startDate && endDate) {
        query.andWhere('e.startDate <= :endDate', { endDate });
        query.andWhere('e.endDate >= :startDate', { startDate });
      }

      // 정렬 필터
      if (sort === '인기순') {
        query
          .orderBy('COUNT(eventLikes.id)', 'DESC')
          .addOrderBy('e.sequence', 'DESC')
          .groupBy('e.id');
      } else {
        query.orderBy('e.sequence', 'DESC').groupBy('e.id');
      }

      const totalCount = await query.getCount();

      query.offset(skip).limit(itemsPerPage);

      const eventList = await query.getRawMany();

      return {
        totalCount,
        page,
        size,
        eventList,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findEventByUserArtist(
    eventIdList: object[],
    page: string,
    size: string,
    sort: string,
  ): Promise<EventListByPageResponseDto> {
    try {
      const itemsPerPage = Number(size) || 12; // 페이지당 아이템 수
      const currentPage = Number(page) || 1; // 현재 페이지

      const skip = (currentPage - 1) * itemsPerPage;

      const query = this.entityManager
        .getRepository(Event)
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.eventLikes', 'eventLikes')
        .select([
          'e.id AS id',
          'e.sequence AS sequence',
          'e.placeName AS placeName',
          'e.description AS description',
          'e.eventType AS eventType ',
          'e.startDate AS startDate',
          'e.endDate AS endDate',
          'e.eventUrl AS eventUrl',
          'e.organizerSns AS organizerSns',
          'e.snsType AS snsType',
          'e.address AS address',
          'e.addressDetail AS addressDetail',
          'e.createdAt AS createdAt',
        ])
        .addSelect(['COUNT(eventLikes.id) AS likeCount'])
        .where('1=1');

      if (eventIdList.length !== 0) {
        query.andWhere('e.id IN (:...eventIdList)', { eventIdList });
      }

      // 정렬 필터
      if (sort === '인기순') {
        query
          .orderBy('COUNT(eventLikes.id)', 'DESC')
          .addOrderBy('e.sequence', 'DESC')
          .groupBy('e.id');
      } else {
        query.orderBy('e.sequence', 'DESC').groupBy('e.id');
      }

      const totalCount = await query.getCount();

      query.offset(skip).limit(itemsPerPage);

      const eventList = await query.getRawMany();

      return { totalCount, eventList };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 인기순 이벤트 조회 top 10
  async findEventByPopularity(): Promise<Event[]> {
    try {
      const query = this.entityManager
        .getRepository(Event)
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.eventLikes', 'eventLikes')
        .select([
          'e.id AS id',
          'e.sequence AS sequence',
          'e.placeName AS placeName',
          'e.description AS description',
          'e.eventType AS eventType ',
          'e.startDate AS startDate',
          'e.endDate AS endDate',
          'e.eventUrl AS eventUrl',
          'e.organizerSns AS organizerSns',
          'e.snsType AS snsType',
          'e.address AS address',
          'e.addressDetail AS addressDetail',
          'e.createdAt AS createdAt',
        ])
        .addSelect(['COUNT(eventLikes.id) AS likeCount'])
        .where('1=1');

      // 현재 날짜 기준으로 검색
      const today = moment().format('YYYY-MM-DD'); // 현재 날짜 및 시간

      query.andWhere('e.startDate <= :today', { today });
      query.andWhere('e.endDate >= :today', { today });

      // 정렬 필터

      query
        .orderBy('COUNT(eventLikes.id)', 'DESC')
        .addOrderBy('e.sequence', 'DESC')
        .groupBy('e.id')
        .limit(10);

      const eventList = await query.getRawMany();

      console.log(eventList);

      return eventList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 새로 등록된 이벤트 조회
  async findNewEventList(eventIdList: object[] = []): Promise<Event[]> {
    try {
      const query = this.entityManager
        .getRepository(Event)
        .createQueryBuilder('e')
        .select([
          'e.id AS id',
          'e.sequence AS sequence',
          'e.placeName AS placeName',
          'e.description AS description',
          'e.eventType AS eventType ',
          'e.startDate AS startDate',
          'e.endDate AS endDate',
          'e.eventUrl AS eventUrl',
          'e.organizerSns AS organizerSns',
          'e.snsType AS snsType',
          'e.address AS address',
          'e.addressDetail AS addressDetail',
          'e.createdAt AS createdAt',
        ])
        .where('1=1');

      if (eventIdList.length !== 0) {
        query.andWhere('e.id IN (:...eventIdList)', { eventIdList });
      }

      // 현재 날짜 - 7일 기준으로 검색
      const day = moment().subtract(7, 'days').format('YYYY-MM-DD'); // 현재 날짜 및 시간

      query.andWhere('e.createdAt >= :day', { day });

      // 정렬 필터

      query.orderBy('e.sequence', 'DESC');

      const eventList = await query.getRawMany();

      return eventList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 이벤트 이미지 조회
  async findEventImageByEventId({ targetEventIds }) {
    try {
      const imageList = await this.entityManager
        .getRepository(EventImage)
        .createQueryBuilder('ei')
        .select([
          'ei.id',
          'ei.imageUrl',
          'ei.isMain',
          'ei.eventId',
          'ei.sequence',
        ])
        .where('ei.eventId IN (:...targetEventIds)', { targetEventIds })
        .orderBy('ei.sequence', 'ASC')
        .getMany();

      return imageList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 아티스트가 참여한 이벤트 조회
  async findEventTargetByTargetId({ userArtistIds }) {
    try {
      const result = await this.entityManager
        .getRepository(EventTarget)
        .createQueryBuilder('et')
        .select(['et.eventId AS eventId'])
        .where(
          '(et.artistId IN (:...userArtistIds) OR et.groupId IN (:...userArtistIds))',
          {
            userArtistIds,
          },
        )
        .getRawMany();

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 이벤트에 참여한 아티스트 조회 (eventId)
  async findEventTargetByEventId({ targetEventIds }) {
    try {
      const artistList = await this.entityManager
        .getRepository(EventTarget)
        .createQueryBuilder('et')
        .select([
          'et.eventId AS eventId',
          'a.id AS artistId',
          'a.artistName AS artistName',
          'g.id AS groupId',
          'g.groupName AS groupName',
        ])
        .leftJoin(Artist, 'a', 'a.id = et.artistId')
        .leftJoin(Group, 'g', 'g.id = et.groupId')
        .where('et.eventId IN (:...targetEventIds)', { targetEventIds })
        .getRawMany();

      return artistList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 검색어로 이벤트 참여 아티스트 조회
  async findEventTargetByKeyword({ keyword }) {
    try {
      const artistList = await this.entityManager
        .getRepository(EventTarget)
        .createQueryBuilder('et')
        .select(['et.eventId AS eventId'])
        .leftJoin(Artist, 'a', 'a.id = et.artistId')
        .leftJoin(Group, 'g', 'g.id = et.groupId')
        .where('a.artistName LIKE :keyword', { keyword: `%${keyword}%` })
        .orWhere('g.groupName LIKE :keyword', { keyword: `%${keyword}%` })
        .groupBy('et.eventId')
        .getRawMany();

      return artistList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // event별 태그 목록 조회
  async findEventTagByEventId({ targetEventIds }) {
    try {
      const tagList = await this.entityManager
        .getRepository(EventTag)
        .createQueryBuilder('et')
        .select([
          'et.eventId AS eventId',
          't.id AS tagId',
          't.tagName AS tagName',
        ])
        .leftJoin(Tag, 't', 't.id = et.tagId')
        .where('et.eventId IN (:...targetEventIds)', { targetEventIds })
        .getRawMany();

      return tagList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 태그Id로 event 조회
  async findEventTagByTagId(tagIdList) {
    try {
      const promiseList: any[] = [];

      tagIdList.forEach((el) => {
        const query = this.entityManager
          .getRepository(Event)
          .createQueryBuilder('e')
          .leftJoinAndSelect('e.eventTags', 'et')
          .select(['e.id AS eventId'])
          .where('1=1');

        query.andWhere('et.tagId = :el', { el });
        promiseList.push(query.getRawMany());
      });

      const data = await Promise.all([...promiseList]);

      const flattenData = data.flat();
      const eventIdCounts = {};
      const eventIdList: string[] = [];

      flattenData.forEach((item) => {
        const { eventId } = item;
        eventIdCounts[eventId] = (eventIdCounts[eventId] || 0) + 1;
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const eventId in eventIdCounts) {
        if (eventIdCounts[eventId] === tagIdList.length) {
          eventIdList.push(eventId);
        }
      }

      return eventIdList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 이벤트 상세 조회
  async findOneEventByEventId(eventId: string) {
    try {
      const event = await this.entityManager
        .getRepository(Event)
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.eventImages', 'ei')
        .where('e.id = :eventId', { eventId })
        .orderBy('ei.sequence', 'ASC')
        .getOne();

      const likeCount = await this.entityManager
        .getRepository(EventLike)
        .createQueryBuilder('el')
        .where('el.eventId = :eventId', { eventId })
        .getCount();

      if (event) {
        event.likeCount = likeCount;
      }

      console.log(event);

      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 유저가 좋아요 누른 이벤트 조회
  async findEventLikeByUserId(
    userId: string,
    status: string,
  ): Promise<Event[]> {
    try {
      const query = this.entityManager
        .getRepository(Event)
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.eventLikes', 'el')
        .select([
          'e.id AS id',
          'e.sequence AS sequence',
          'e.userId AS userId',
          'e.placeName AS placeName',
          'e.description AS description',
          'e.eventType AS eventType ',
          'e.startDate AS startDate',
          'e.endDate AS endDate',
          'e.eventUrl AS eventUrl',
          'e.organizerSns AS organizerSns',
          'e.snsType AS snsType',
          'e.address AS address',
          'e.addressDetail AS addressDetail',
          'e.createdAt AS createdAt',
        ])
        .addSelect(['COUNT(el.id) AS likeCount'])
        .where('el.userId = :userId', { userId });

      // if (targetDate) {
      //   query.andWhere('e.startDate <= :targetDate', { targetDate });
      //   query.andWhere('e.endDate >= :targetDate', { targetDate });
      // }

      // 현재 날짜 기준으로 검색
      const today = moment().format('YYYY-MM-DD'); // 현재 날짜 및 시간

      if (status === '종료') {
        query.andWhere('e.endDate < :today', { today });
      } else if (status === '진행중') {
        query.andWhere('e.startDate <= :today', { today });
        query.andWhere('e.endDate >= :today', { today });
      } else if (status === '예정') {
        query.andWhere('e.startDate > :today', { today });
      } else if (status === '종료제외') {
        query.andWhere('e.endDate > :today', { today });
      }

      // if (cursorId) {
      //   query.andWhere(`e.sequence < ${cursorId}`);
      // }

      query.groupBy('e.id');
      query.orderBy('e.sequence', 'DESC');

      // query.limit(size);

      const eventList = await query.getRawMany();

      return eventList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createEvent(
    eventInfo: EventCreateRequest,
  ): Promise<EventCreateResponse | null> {
    try {
      const {
        groupId, artists, tags, eventImages, ...rest
      } = eventInfo;

      const result = await this.entityManager.transaction(
        async (transactioManager) => {
          // 1. 행사 저장
          const insertEvent = await transactioManager
            .getRepository(Event)
            .createQueryBuilder()
            .insert()
            .into(Event)
            .values([rest])
            .execute();

          if (insertEvent.raw === 0) {
            throw new InternalServerErrorException('event save fail');
          }

          const { id } = insertEvent.identifiers[0];

          const artistDataToInsert = artists.map((el) => ({
            groupId,
            artistId: el,
            eventId: id,
          }));

          // 2. 행사 참여 아티스트 저장
          await transactioManager
            .getRepository(EventTarget)
            .createQueryBuilder()
            .insert()
            .into(EventTarget)
            .values(artistDataToInsert)
            .execute();

          // 3. 태그 정보가 있는 경우 저장
          if (tags && tags.length !== 0) {
            const tagDataToInsert = tags.map((el) => ({
              tagId: el,
              eventId: id,
            }));

            await transactioManager
              .getRepository(EventTag)
              .createQueryBuilder()
              .insert()
              .into(EventTag)
              .values(tagDataToInsert)
              .execute();
          }

          // 4. 행사 이미지 정보가 있는 경우 저장
          if (eventImages && eventImages.length !== 0) {
            const imageDataToInsert = eventImages.map((el, idx) => {
              if (idx === 0) {
                return {
                  eventId: id,
                  imageUrl: el,
                  isMain: true,
                  sequence: idx,
                };
              }
              return {
                eventId: id,
                imageUrl: el,
                isMain: false,
                sequence: idx,
              };
            });

            await transactioManager
              .getRepository(EventImage)
              .createQueryBuilder()
              .insert()
              .into(EventImage)
              .values(imageDataToInsert)
              .execute();
          }

          return id;
        },
      );

      return { eventId: result };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    eventUpdateRequest: EventUpdateRequest,
  ): Promise<Event | null> {
    try {
      const {
        groupId, artists, tags, eventImages, ...rest
      } = eventUpdateRequest;

      const originEvent = await this.entityManager
        .getRepository(Event)
        .findOne({ where: { id: eventId } });

      if (!originEvent) throw new NotFoundException('Event not exist');

      const result = await this.entityManager.transaction(
        async (transactioManager) => {
          // 1. 행사 수정
          await transactioManager.getRepository(Event).save({
            ...originEvent,
            ...rest,
          });

          await transactioManager
            .getRepository(EventTarget)
            .delete({ eventId });

          const artistDataToInsert = artists.map((el) => ({
            groupId,
            artistId: el,
            eventId,
          }));

          // 2. 행사 참여 아티스트 저장
          await transactioManager
            .getRepository(EventTarget)
            .createQueryBuilder()
            .insert()
            .into(EventTarget)
            .values(artistDataToInsert)
            .execute();

          // 3. 태그 정보가 있는 경우 저장
          // 기존 태그 삭제
          await transactioManager.getRepository(EventTag).delete({ eventId });

          if (tags && tags.length !== 0) {
            const tagDataToInsert = tags.map((el) => ({
              tagId: el,
              eventId,
            }));

            await transactioManager
              .getRepository(EventTag)
              .createQueryBuilder()
              .insert()
              .into(EventTag)
              .values(tagDataToInsert)
              .execute();
          }

          // 4. 행사 이미지 정보가 있는 경우 저장

          // 기존 정보 삭제
          await transactioManager.getRepository(EventImage).delete({ eventId });

          if (eventImages && eventImages.length !== 0) {
            const imageDataToInsert = eventImages.map((el, idx) => {
              if (idx === 0) {
                return {
                  eventId,
                  imageUrl: el,
                  isMain: true,
                  sequence: idx,
                };
              }
              return {
                eventId,
                imageUrl: el,
                isMain: false,
                sequence: idx,
              };
            });

            await transactioManager
              .getRepository(EventImage)
              .createQueryBuilder()
              .insert()
              .into(EventImage)
              .values(imageDataToInsert)
              .execute();
          }
          const event = await this.findOneEventByEventId(eventId);

          return event;
        },
      );

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 행사 수정 신청
  async createEventUpdateApplication(
    eventUpdateApplicationRequestDto: EventUpdateApplicationRequestDto,
  ): Promise<String> {
    try {
      const {
        updateCategory, eventId, userId, ...rest
      } = eventUpdateApplicationRequestDto;

      const originEvent = await this.entityManager
        .getRepository(Event)
        .findOne({ where: { id: eventId } });

      if (!originEvent) {
        throw new NotFoundException('Event Applicaion not exist');
      }

      let data: object;
      let updateData: string;
      await this.entityManager
        .transaction(async (transactioManager) => {
          await Promise.all(
            updateCategory.map(async (el) => {
              if (el === 'artist') {
                data = {
                  groupId: rest.groupId,
                  artists: rest.artists,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'eventType') {
                data = {
                  eventType: rest.eventType,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'placeName') {
                data = {
                  placeName: rest.placeName,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'address') {
                data = {
                  address: rest.address,
                  addressDetail: rest.addressDetail,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'period') {
                data = {
                  startDate: rest.startDate,
                  endDate: rest.endDate,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'tags') {
                data = {
                  tags: rest.tags,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'eventImages') {
                data = {
                  eventImages: rest.eventImages,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'organizer') {
                data = {
                  organizerSns: rest.organizerSns,
                  snsType: rest.snsType,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'eventUrl') {
                data = {
                  eventUrl: rest.eventUrl,
                };

                updateData = JSON.stringify(data);
              } else if (el === 'description') {
                data = {
                  description: rest.description,
                };

                updateData = JSON.stringify(data);
              }

              return transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: el,
                  updateData,
                });
            }),
          );
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });

      return 'Application completed';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 행사 수정 신청 v1
  async createEventUpdateApplicatiov1(
    eventUpdateApplicationRequestDto: EventUpdateApplicationRequestDto,
  ): Promise<String> {
    try {
      const {
        updateCategory, eventId, userId, ...rest
      } = eventUpdateApplicationRequestDto;

      const originEvent = await this.entityManager
        .getRepository(Event)
        .findOne({ where: { id: eventId } });

      if (!originEvent) {
        throw new NotFoundException('Event Applicaion not exist');
      }

      let data: object;
      let updateData: string;
      await this.entityManager
        .transaction(async (transactioManager) => {
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < updateCategory.length; i++) {
            if (updateCategory[i] === 'artist') {
              data = {
                groupId: rest.groupId,
                artists: rest.artists,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'eventType') {
              data = {
                eventType: rest.eventType,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'placeName') {
              data = {
                placeName: rest.placeName,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'address') {
              data = {
                address: rest.address,
                addressDetail: rest.addressDetail,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'period') {
              data = {
                startDate: rest.startDate,
                endDate: rest.endDate,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'tags') {
              data = {
                tags: rest.tags,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'eventImages') {
              data = {
                eventImages: rest.eventImages,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'organizer') {
              data = {
                organizerSns: rest.organizerSns,
                snsType: rest.snsType,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'eventUrl') {
              data = {
                eventUrl: rest.eventUrl,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            } else if (updateCategory[i] === 'description') {
              data = {
                description: rest.description,
              };

              updateData = JSON.stringify(data);

              // eslint-disable-next-line no-await-in-loop
              await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  eventId,
                  userId,
                  updateCategory: updateCategory[i],
                  updateData,
                });
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });

      return 'Application completed';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 행사 수정 승인 및 거절
  async approveEventUpdate(
    eventUpdateApprovalRequestDto: EventUpdateApprovalRequestDto,
  ): Promise<EventUpdateApplication | null> {
    try {
      const { eventUpdateApplicationId, isApproved, userId } = eventUpdateApprovalRequestDto;

      const application = await this.entityManager
        .getRepository(EventUpdateApplication)
        .findOne({ where: { id: eventUpdateApplicationId } });

      if (!application) {
        throw new NotFoundException('Event Applicaion not exist');
      }

      if (application.isReflected) {
        throw new ConflictException(
          'The application has already been reflected',
        );
      }

      const approval = await this.entityManager
        .getRepository(EventUpdateApproval)
        .findOne({ where: { eventUpdateApplicationId, userId } });

      if (approval) {
        throw new ConflictException('Already approved or rejected');
      }

      const result = await this.entityManager.transaction(
        async (transactioManager) => {
          await transactioManager.getRepository(EventUpdateApproval).save({
            eventUpdateApplicationId,
            userId,
            isApproved,
          });

          // 승인인 경우
          if (isApproved) {
            let approvalResult = await transactioManager
              .getRepository(EventUpdateApplication)
              .save({
                ...application,
                approvalCount: application.approvalCount + 1,
              });

            if (approvalResult.approvalCount === 3) {
              const updateData = JSON.parse(application.updateData);

              if (approvalResult.updateCategory === 'tags') {
                await transactioManager
                  .getRepository(EventTag)
                  .delete({ eventId: application.eventId });

                if (updateData.tags && updateData.tags.length !== 0) {
                  const tagDataToInsert = updateData.tags.map((el: string) => ({
                    tagId: el,
                    eventId: application.eventId,
                  }));

                  await transactioManager
                    .getRepository(EventTag)
                    .createQueryBuilder()
                    .insert()
                    .into(EventTag)
                    .values(tagDataToInsert)
                    .execute();
                }
              } else if (approvalResult.updateCategory === 'eventImages') {
                await transactioManager
                  .getRepository(EventImage)
                  .delete({ eventId: application.eventId });

                if (
                  updateData.eventImages
                  && updateData.eventImages.length !== 0
                ) {
                  const imageDataToInsert = updateData.eventImages.map(
                    (el: string, idx: number) => {
                      if (idx === 0) {
                        return {
                          eventId: application.eventId,
                          imageUrl: el,
                          isMain: true,
                          sequence: idx,
                        };
                      }
                      return {
                        eventId: application.eventId,
                        imageUrl: el,
                        isMain: false,
                        sequence: idx,
                      };
                    },
                  );

                  await transactioManager
                    .getRepository(EventImage)
                    .createQueryBuilder()
                    .insert()
                    .into(EventImage)
                    .values(imageDataToInsert)
                    .execute();
                }
              } else {
                // 수정 반영
                const event = await transactioManager
                  .getRepository(Event)
                  .findOne({ where: { id: application.eventId } });

                await transactioManager.getRepository(Event).save({
                  ...event,
                  ...updateData,
                });
              }

              // 수정 완료로 변경
              approvalResult = await transactioManager
                .getRepository(EventUpdateApplication)
                .save({
                  ...approvalResult,
                  isReflected: true,
                });
            }
            return approvalResult;
          }
          // 거절인 경우
          const rejectionResult = await transactioManager
            .getRepository(EventUpdateApplication)
            .save({
              ...application,
              rejectionCount: application.rejectionCount + 1,
            });

          // 3회인 경우 삭제
          if (rejectionResult.rejectionCount === 3) {
            await transactioManager
              .getRepository(EventUpdateApplication)
              .softDelete({ id: eventUpdateApplicationId });
          }

          return rejectionResult;
        },
      );

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 신청 목록 조회
  async findUpdateApplication(
    eventId: string,
  ): Promise<EventUpdateApplication[] | null> {
    try {
      const applicationList = await this.entityManager
        .getRepository(EventUpdateApplication)
        .find({ where: { eventId } });

      return applicationList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 신청 상세 내역 조회
  async findUpdateApplicationDetail(
    eventUpdateApplicationId: string,
  ): Promise<EventUpdateApplication | null> {
    try {
      const application = await this.entityManager
        .getRepository(EventUpdateApplication)
        .findOne({ where: { id: eventUpdateApplicationId } });

      if (!application) {
        throw new NotFoundException('Event Applicaion not exist');
      }

      return application;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // =======================================
  // 좋아요 관련
  async checkLikeStatus({ eventId, userId }): Promise<boolean> {
    try {
      const like = await this.entityManager
        .getRepository(EventLike)
        .findOne({ where: { eventId, userId } });

      // 좋아요 X
      if (!like) {
        return false;
      }

      // 좋아요 한 경우
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findCountLike(eventId: string): Promise<number> {
    try {
      const like = await this.entityManager
        .getRepository(EventLike)
        .findAndCount({ where: { eventId } });

      console.log(like);

      // 좋아요 수
      return like[1];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async likeToggle({ eventId, userId }): Promise<boolean> {
    try {
      const like = await this.entityManager
        .getRepository(EventLike)
        .findOne({ where: { eventId, userId } });

      // 이미 좋아요한 경우
      if (like) {
        if (
          await this.entityManager
            .getRepository(EventLike)
            .delete({ id: like.id })
        ) {
          return false;
        }
      }

      await this.entityManager.getRepository(EventLike).save({
        eventId,
        userId,
      });

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // =======================================
  // 태그 조회
  async findTag(tagIds: string[] | null): Promise<Tag[] | null> {
    try {
      const query = this.entityManager
        .getRepository(Tag)
        .createQueryBuilder('t');

      if (tagIds) {
        query.where('t.id IN (:...tagIds)', { tagIds });
      }

      const tagList = await query.getMany();

      return tagList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // ========= 신고
  async createEventClaim(eventClaimDto: EventClaimDto): Promise<String | null> {
    try {
      const event = await this.entityManager
        .getRepository(Event)
        .findOne({ where: { id: eventClaimDto.eventId } });

      if (!event) throw new NotFoundException('Event not exist');

      const insertEventClaim = await this.entityManager
        .getRepository(EventClaim)
        .createQueryBuilder()
        .insert()
        .into(EventClaim)
        .values([eventClaimDto])
        .execute();

      return insertEventClaim.identifiers[0].id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
