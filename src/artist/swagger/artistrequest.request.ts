import { ApiProperty } from '@nestjs/swagger';

export class ArtistRequest {
  @ApiProperty({ description: '요청 아티스트 이름', default: '장기하' })
    name: string;
}
