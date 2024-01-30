import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistService } from './artist.service';
import { ArtistResponse } from './dto/artist.response';

@ApiTags('그룹&아티스트')
@Controller('/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOperation({
    summary: '아티스트 목록 조회',
    description: `등록된 모든 아티스트를 조회합니다. 
      **group_id, group_name이 null인 경우 솔로**`,
  })
  @ApiCreatedResponse({
    description: '등록된 아티스트 목록',
    type: [ArtistResponse],
  })
  async getArtistList(): Promise<ArtistResponse[] | null> {
    try {
      return await this.artistService.getArtistList();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: '그룹별 아티스트 조회',
    description: '특정 그룹의 모든 아티스트를 조회합니다.',
  })
  @ApiParam({
    description: '조회할 그룹의 ID',
    name: 'id',
    type: String,
  })
  @ApiCreatedResponse({
    description: '특정 그룹 아티스트 목록',
    type: [ArtistResponse],
  })
  async getArtistListByGroup(
    @Param('id') groupId: string,
  ): Promise<ArtistResponse[] | null> {
    try {
      return await this.artistService.getArtistListByGroup(groupId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @ApiOperation({
    summary: '아티스트 등록',
    description: '새로운 아티스트를 등록합니다.',
  })
  @ApiBody({ type: ArtistCreateRequest })
  @ApiCreatedResponse({
    description: '정상 등록된 아티스트에 대한 정보',
    type: ArtistResponse,
  })
  async createArtist(
    @Body() artistCreateDto: ArtistCreateRequest,
  ): Promise<ArtistResponse | null> {
    try {
      return await this.artistService.createArtist(artistCreateDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
