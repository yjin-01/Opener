import { ApiProperty } from '@nestjs/swagger';

export class EmailSendBadRequest {
  @ApiProperty({
    description: '대략적인 실패 내용',
    default: 'Validation failed',
  })
    message: string;

  @ApiProperty({ description: 'http status 내용', default: 'Bad Request' })
    error: string;

  @ApiProperty({ description: 'http status code', default: 400 })
    statusCode: number;
}
