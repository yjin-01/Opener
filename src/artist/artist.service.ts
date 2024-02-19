import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistRepository } from './artist.repository';
import { ArtistListResponse } from './dto/artist.list.response';
import { Artist } from './entity/artist.entity';
import { ArtistRequestCreateResponse } from './dto/artistrequest.create.response';

@Injectable()
export class ArtistService {
  constructor(private readonly artistRepository: ArtistRepository) {}

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
