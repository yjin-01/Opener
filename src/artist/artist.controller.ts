import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistService } from './artist.service';
import { ArtistResponse } from './swagger/artist.response';
import { ArtistListResponse } from './dto/artist.list.response';
import { ArtistGroupListRequest } from './swagger/artist.artistgrouplist.request';
import { Artist } from './entity/artist.entity';
import { ArtistCreateResponseInterceptor } from './interceptor/artist.create.response.interceptor';

@ApiTags('그룹&아티스트')
@Controller('/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('/group')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '그룹,아티스트(멤버 +  솔로) 목록 조회',
    description: `등록된 모든 그룹,아티스트를 조회합니다. 
      [그룹명, 아티스트명으로 검색 가능]`,
  })
  @ApiQuery({
    name: 'getArtistListRequest',
    type: ArtistGroupListRequest,
  })
  @ApiCreatedResponse({
    description: '등록된 그룹, 아티스트(멤버 +  솔로) 목록',
    type: ArtistListResponse,
  })
  async getArtistList(
    @Query('keyword') keyword: string,
      @Query('page', ParseIntPipe) page: number,
      @Query('size', ParseIntPipe) size: number,
  ): Promise<ArtistListResponse | null> {
    try {
      return await this.artistService.getArtistList({
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
  @ApiBearerAuth('accessToken')
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
  ): Promise<Artist[] | null> {
    try {
      return await this.artistService.getArtistListByGroup(groupId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @UseInterceptors(ArtistCreateResponseInterceptor)
  @Post()
  @ApiBearerAuth('accessToken')
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
  ): Promise<Artist | null> {
    try {
      return await this.artistService.createArtist(artistCreateDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
