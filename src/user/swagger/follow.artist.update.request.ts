import { ApiPropertyOptional } from '@nestjs/swagger';

export class FollowArtistUpdateRequest {
  @ApiPropertyOptional({
    name: 'deleteArtistIds',
    description: '삭제할 팔로우 아티스트 아이디',
    default: [
      'cc27b75b-0d6d-4fba-ba20-245561bb7d41',
      '01e4e788-92f6-4347-9593-bb3095a221d7',
    ],
  })
    deleteArtistIds: string[];

  @ApiPropertyOptional({
    name: 'addArtistIds',
    description: '새로 팔로우할 아티스트 아이디',
    default: [
      'b1fcfda6-eb30-4479-b431-c90b151c6b87',
      'cb307bdc-a403-4b5e-981e-ad589f9d7b44',
    ],
  })
    addArtistIds: string[];
}
