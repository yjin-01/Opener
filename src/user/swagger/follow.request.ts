import { ApiProperty } from '@nestjs/swagger';

export class FollowRequest {
  @ApiProperty({ description: 'follow 할 아티스트 아이디' })
    artistId: string[];
}
