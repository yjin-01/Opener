import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ArtistGroupListResponse } from '../swagger/artist.artistgrouplist.response';

@Exclude()
export class ArtistListResponse {
  @ApiProperty({
    description: '전체 개수',
    default: 100,
  })
  @Expose()
    totalCount: number;

  @ApiProperty({
    description: '페이지',
    default: 1,
  })
  @Expose()
    page: number;

  @ApiProperty({
    description: '데이터 개수',
    default: 12,
  })
  @Expose()
    size: number;

  @ApiProperty({
    description: '등록된 아티스트&그룹 리스트',
    type: [ArtistGroupListResponse],
  })
  @Expose()
    artistAndGroupList: ArtistGroupListResponse[];
}
