import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArtistList {
  @ApiPropertyOptional({
    description: '이벤트 ID',
    default: 'be14e489-1b39-422e-aef2-f9041ef9e375',
  })
    eventId: string;

  @ApiPropertyOptional({
    description: '아티스트 ID',
    default: '',
  })
    artistId: string;

  @ApiPropertyOptional({
    description: '아티스트 이름',
    default: 'test',
  })
    artistName: string;

  @ApiPropertyOptional({
    description: '그룹ID',
    default: '~~',
  })
    groupId: string;

  @ApiPropertyOptional({
    description: '그룹이름',
    default: 'NCT',
  })
    groupName: string;
}
