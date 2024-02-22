import { ApiPropertyOptional } from '@nestjs/swagger';

export class FollowArtistUpdateRequest {
  @ApiPropertyOptional({
    name: 'deleteArtistIds',
    description: '삭제할 팔로우 아티스트 아이디',
    default: [
      '6fe08669-e92d-437b-b450-c8421b985edb',
      '721b1eb9-fcab-47d6-a282-9ed85c7f5b1e',
    ],
  })
    deleteArtistIds: string[];

  @ApiPropertyOptional({
    name: 'deleteArtistIds',
    description: '삭제할 팔로우 아티스트 그룹 아이디',
    default: [
      'f2afbab4-9260-4545-af83-7915d5c2118a',
      'c1f9e0ba-06b0-4d40-bab9-d2010a9555dd',
    ],
  })
    deleteGroupIds: string[];

  @ApiPropertyOptional({
    name: 'addArtistIds',
    description: '새로 팔로우할 아티스트 아이디',
    default: [
      '8777d21b-7ca0-42a8-a8cb-39df2dee6642',
      '8bbcaf81-f826-413f-bf46-a40b026c56d1',
    ],
  })
    addArtistIds: string[];

  @ApiPropertyOptional({
    name: 'addArtistIds',
    description: '새로 팔로우할 아티스트 그룹 아이디',
    default: [
      '3c36e3e4-4180-4b09-aecb-77aa5e4b646f',
      '15e2c65f-9d5b-43e2-ab52-004bd2b47435',
    ],
  })
    addGroupIds: string[];
}
