import { ApiProperty } from '@nestjs/swagger';

export class ReviewNotfoundResponse {
  @ApiProperty({
    description: '대략적인 실패 내용',
    default: 'user not exist',
  })
    message: string;

  @ApiProperty({ description: 'http status 내용', default: 'Not Founded' })
    error: string;

  @ApiProperty({ description: 'http status code', default: 404 })
    statusCode: number;
}
