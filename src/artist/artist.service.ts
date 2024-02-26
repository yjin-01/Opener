import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventRepository } from 'src/event/event.repository';
import * as moment from 'moment';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistRepository } from './artist.repository';
import { ArtistListResponse } from './dto/artist.list.response';
import { Artist } from './entity/artist.entity';
import { ArtistRequestCreateResponse } from './dto/artistrequest.create.response';

@Injectable()
export class ArtistService {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async createArtist(artistInfo: ArtistCreateRequest): Promise<Artist | null> {
    try {
      const result = await this.artistRepository.create(artistInfo);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtistList({
    keyword,
    page,
    size,
  }): Promise<ArtistListResponse | null> {
    try {
      const result = await this.artistRepository.findAllArtsitAndGroup({
        keyword,
        page,
        size,
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtistListByMonth({ month }) {
    try {
      const artistList = await this.artistRepository.findAllArtsitAndGroupByMonth({
        month,
      });

      const userArtistIds = artistList.map((el) => el.id);

      const targetDate = moment().format('YYYY-MM-DD');

      const targetEvent = await this.eventRepository.findEventTargetByTargetDate(
        userArtistIds,
        targetDate,
      );

      artistList.forEach((artist) => {
        Object.assign(artist, { eventStatus: false });
        targetEvent.forEach((event) => {
          if (artist.id === event.artistId) {
            Object.assign(artist, { eventStatus: true });
          } else if (artist.id === event.groupId) {
            Object.assign(artist, { eventStatus: true });
          }
        });
      });

      return artistList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtistListByGroup(groupId: string): Promise<Artist[] | null> {
    try {
      const result = await this.artistRepository.findAllArtsitByGroup(groupId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtistByArtistId(artists: string): Promise<Artist[] | null> {
    try {
      if (!artists) {
        throw new BadRequestException();
      }

      const artistIds = artists.split(',');

      if (artistIds.length === 0) {
        throw new BadRequestException();
      }

      const result = await this.artistRepository.findArtistByArtistId(artistIds);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async requestArtist(
    userRequest,
  ): Promise<ArtistRequestCreateResponse | null> {
    try {
      const id = await this.artistRepository.createArtistRequest(userRequest);
      return plainToInstance(ArtistRequestCreateResponse, { id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
