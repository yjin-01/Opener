import { Injectable } from '@nestjs/common';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistRepository } from './artist.repository';
import { ArtistListResponse } from './dto/artist.list.response';
import { Artist } from './entity/artist.entity';

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

  async requestArtist(userRequest): Promise<number | null> {
    try {
      return await this.artistRepository.createArtistRequest(userRequest);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
