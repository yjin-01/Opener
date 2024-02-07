import { ApiProperty } from '@nestjs/swagger';

export class EventNotfoundResponse {
  @ApiProperty({
    description: '실패 내용',
    default: 'event not exist',
  })
    message: string;

  @ApiProperty({ description: 'http status', default: 'Not Found' })
    error: string;

  @ApiProperty({ description: 'http status code', default: 404 })
    statusCode: number;
}
