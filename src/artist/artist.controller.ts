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
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ArtistCreateRequest } from './dto/artist.create.request';
import { ArtistService } from './artist.service';
import { ArtistResponse } from './swagger/artist.response';
import { ArtistListResponse } from './dto/artist.list.response';
import { ArtistGroupListRequest } from './swagger/artist.artistgrouplist.request';
import { Artist } from './entity/artist.entity';
import { ArtistCreateResponseInterceptor } from './interceptor/artist.create.response.interceptor';
import { ArtistRequestCreateRequest } from './dto/artistrequest.create.request';
import { ArtistRequest } from './swagger/artistrequest.request';
import { ArtistRequestBadRequest } from './swagger/artistrequest.create.response';
import { ArtistRequestCreateResponse } from './dto/artistrequest.create.response';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('그룹&아티스트')
@Controller('/artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Public()
  @Get('/group')
  @ApiOperation({
    summary: '그룹,아티스트(멤버 +  솔로) 목록 조회',
    description: `등록된 모든 그룹,아티스트를 조회합니다. 
      [그룹명, 아티스트명으로 검색 가능]`,
  })
  @ApiQuery({
    name: 'getArtistListRequest',
    type: ArtistGroupListRequest,
  })
  @ApiOkResponse({
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

  @Public()
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
  @ApiOkResponse({
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

  @Public()
  @Get()
  @ApiOperation({
    summary: '아티스트 Id를 이용한 아티스트 조회',
    description: '아티스트를 조회합니다.',
  })
  @ApiQuery({
    name: 'artists',
    description: '조회할 아티스트들의 ID',
    type: String,
    example: '1fab0958-dafc-48,454d54d7-a6c8-4c',
  })
  @ApiOkResponse({
    description: '아티스트 목록',
    type: [ArtistResponse],
  })
  async getArtistByArtistId(
    @Query('artists') artists: string,
  ): Promise<Artist[] | null> {
    try {
      return await this.artistService.getArtistByArtistId(artists);
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.error(error);
        throw error;
      }
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
  @ApiOkResponse({
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

  @Public()
  @Post('/request')
  @ApiOperation({
    summary: '아티스트 요청',
    description: '회원 가입 전에 유저가 원하는 아티스트를 요청할 수 있습니다.',
  })
  @ApiBody({ type: ArtistRequest })
  @ApiOkResponse({
    description: '정상 등록된 아티스트에 대한 정보',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: ArtistRequestBadRequest,
  })
  async createArtistRequest(
    @Body() artistRequest: ArtistRequestCreateRequest,
  ): Promise<ArtistRequestCreateResponse | null> {
    try {
      return await this.artistService.requestArtist(artistRequest);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
