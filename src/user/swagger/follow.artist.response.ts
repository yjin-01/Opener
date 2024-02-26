import { ApiProperty } from '@nestjs/swagger';

export class FollowArtistResponse {
  @ApiProperty({ description: '아티스트 아이디' })
    id: string;

  @ApiProperty({ description: '아티스트 이름' })
    name: string;

  @ApiProperty({ description: '아티스트 이미지' })
    image: string;

  @ApiProperty({ description: '아티스트 타입' })
    type: string;
}
