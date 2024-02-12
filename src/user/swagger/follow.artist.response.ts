import { ApiProperty } from '@nestjs/swagger';

export class FollowArtistResponse {
  @ApiProperty({ description: '아티스트 아이디' })
    artistId: string;

  @ApiProperty({ description: '아티스트 이름' })
    artistName: string;

  @ApiProperty({ description: '아티스트 이미지' })
    artistImage: string;
}
