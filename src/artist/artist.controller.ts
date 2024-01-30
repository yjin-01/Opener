import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistService } from './artist.service';
import { ArtistResponse } from './dto/artist.response';
import { GetArtistListRequest } from './swagger/artist.getlist.request';
import { ArtistListResponse } from './dto/artist.list.response';

@ApiTags('그룹&아티스트')
@Controller('/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOperation({
    summary: '아티스트 목록 조회',
    description: `등록된 모든 아티스트를 조회합니다. 
      [**group_id, group_name이 null인 경우 솔로**]
      [그룹명, 아티스트명으로 검색 가능]`,
  })
  @ApiQuery({
    name: 'getArtistListRequest',
    type: GetArtistListRequest,
  })
  @ApiCreatedResponse({
    description: '등록된 아티스트 목록',
    type: [ArtistListResponse],
  })
  async getArtistList(
    @Query('category') category: string,
      @Query('keyword') keyword: string,
      @Query('page') page: number,
      @Query('size') size: number,
  ): Promise<ArtistListResponse | null> {
    try {
      console.log(typeof page, page);
      console.log(typeof size, size);
      return await this.artistService.getArtistList({
        category,
        keyword,
        page,
        size,
      });
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
    name: 'id',
    description: '조회할 그룹의 ID',
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
