import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Artist } from 'src/artist/entity/artist.entity';
import { Group } from 'src/group/entity/group.entity';
import { User } from 'src/user/entity/user.entity';
import { EventCreateRequest } from './dto/event.create.request';
import { Event } from './entity/event.entity';
import { EventTarget } from './entity/event_target.entity';
import { EventTag } from './entity/event_tag.entity';
import { EventImage } from './entity/event_image.entity';
import { EventCreateResponse } from './dto/event.create.response';
import { Tag } from './entity/tag.entity';

@Injectable()
export class EventRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findAllEvent({ getEventListDto, eventIdList }) {
    const {
      sido, gungu, startDate, endDate, page, size,
    } = getEventListDto;

    const itemsPerPage = size || 12; // 페이지당 아이템 수
    const currentPage = page || 1; // 현재 페이지

    const skip = (currentPage - 1) * itemsPerPage;

    const query = this.entityManager
      .getRepository(Event)
      .createQueryBuilder('e')
      .select([
        'e.id AS eventId',
        'e.placeName AS placeName',
        'e.description AS description',
        'e.event_type AS eventType',
        'e.start_date AS startDate',
        'e.end_date AS endDate',
        'e.event_url AS eventUrl',
        'e.organizer_sns AS organizerSns',
        'e.sns_type AS snsType',
        'e.address AS address',
        'e.addressDetail AS addressDetail',
        'ei.eventImage AS mainImage',
        'u.id AS writerId',
        'u.alias AS writerAlias',
      ])
      .leftJoin(EventImage, 'ei', 'ei.eventId = e.id')
      .leftJoin(User, 'u', 'u.id = e.user_id')
      .where('1=1')
      .andWhere('ei.mainImage = 1');

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

    query
      .groupBy('e.id')
      .offset(skip)
      .limit(itemsPerPage)
      .orderBy('e.createdAt', 'DESC');

    const result = await query.getRawMany();

    return result;
  }

  // 이벤트 참여 아티스트 조회
  async findEventTargetByEventId({ targetEventIds }) {
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
  }

  // 이벤트 참여 아티스트 조회
  async findEventTargetByKeyword({ keyword }) {
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
  }

  async findEventTagByEventId({ targetEventIds }) {
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
  }

  // 태그를 포함하고 있는 eventId 조회
  async findEventTagByTagId({ tags }) {
    const tagList = await this.entityManager
      .getRepository(EventTag)
      .createQueryBuilder('et')
      .select(['et.eventId AS eventId'])
      .where('et.tagId IN (:...tags)', { tags })
      .groupBy('et.eventId')
      .getRawMany();

    return tagList;
  }

  async findOneByEventId({ eventId }) {
    // const event = this.entityManager
    //   .getRepository(Event)
    //   .createQueryBuilder('e')
    //   .select([
    //     'e.id AS eventId',
    //     'e.placeName AS placeName',
    //     'e.description AS description',
    //     'e.event_type AS eventType',
    //     'e.start_date AS startDate',
    //     'e.end_date AS endDate',
    //     'e.event_url AS eventUrl',
    //     'e.organizer_sns AS organizerSns',
    //     'e.sns_type AS snsType',
    //     'e.address AS address',
    //     'e.addressDetail AS addressDetail',
    //     'ei.eventImage AS mainImage',
    //     'u.id AS writerId',
    //     'u.alias AS writerAlias',
    //   ])
    //   .leftJoin(EventImage, 'ei', 'ei.eventId = e.id')
    //   .leftJoin(User, 'u', 'u.id = e.user_id')
    //   .where('e.id = :eventId ', { eventId })
    //   .getRawOne();

    const event = await this.entityManager.getRepository(Event).findOne({
      select: { updatedAt: false },
      where: { id: eventId },
      relations: ['eventImages', 'userId'],
    });

    return event;
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
            throw new InternalServerErrorException();
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
                  eventImage: el,
                  mainImage: true,
                };
              }
              return {
                eventId: id,
                eventImage: el,
                mainImage: false,
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
}
