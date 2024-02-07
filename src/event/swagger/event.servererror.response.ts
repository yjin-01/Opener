import { ApiProperty } from '@nestjs/swagger';

export class EventInternalServerResponse {
  @ApiProperty({
    description: '서버에러 내용',
  })
    message: string;

  @ApiProperty({ description: 'http status', default: 'Internal Server Error' })
    error: string;

  @ApiProperty({ description: 'http status code', default: 500 })
    statusCode: number;
}
