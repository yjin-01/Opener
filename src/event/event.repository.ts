import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventCreateRequest } from './dto/event.create.request';
import { Event } from './entity/event.entity';
import { EventTarget } from './entity/event_target.entity';
import { EventTag } from './entity/event_tag.entity';
import { EventImage } from './entity/event_image.entity';
import { EventCreateResponse } from './dto/event.create.response';

@Injectable()
export class EventRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createEvent(
    eventInfo: EventCreateRequest,
  ): Promise<EventCreateResponse | null> {
    try {
      const {
        groupId, artists, tags, eventImages, ...rest
      } = eventInfo;

      // 1. 행사 저장
      const insertEvent = await this.entityManager
        .getRepository(Event)
        .createQueryBuilder()
        .insert()
        .into(Event)
        .values([rest])
        .execute();

      if (insertEvent.raw === 0) {
        throw new InternalServerErrorException();
      }

      const insertEventId = insertEvent?.identifiers[0].eventId.slice(0, 16);

      const artistDataToInsert = artists.map((el) => ({
        groupId,
        artistId: el,
        eventId: insertEventId,
      }));

      // 2. 행사 참여 아티스트 저장
      await this.entityManager
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
          eventId: insertEventId,
        }));

        await this.entityManager
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
              eventId: insertEventId,
              eventImage: el,
              mainImage: true,
            };
          }
          return {
            eventId: insertEventId,
            eventImage: el,
            mainImage: false,
          };
        });

        await this.entityManager
          .getRepository(EventImage)
          .createQueryBuilder()
          .insert()
          .into(EventImage)
          .values(imageDataToInsert)
          .execute();
      }

      return { eventId: insertEventId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
