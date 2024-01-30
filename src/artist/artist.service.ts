import { Injectable } from '@nestjs/common';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistRepository } from './artist.repository';
import { ArtistResponse } from './dto/artist.response';

@Injectable()
export class ArtistService {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async createArtist(
    artistInfo: ArtistCreateRequest,
  ): Promise<ArtistResponse | null> {
    try {
      const result = await this.artistRepository.createArtist(artistInfo);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtistList(
    category: string,
    keyword: string,
  ): Promise<ArtistResponse[] | null> {
    try {
      const result = await this.artistRepository.findAllArtsit(
        category,
        keyword,
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtistListByGroup(
    groupId: string,
  ): Promise<ArtistResponse[] | null> {
    try {
      const result = await this.artistRepository.findAllArtsitByGroup(groupId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
