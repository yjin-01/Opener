import { ApiProperty } from '@nestjs/swagger';

export class EventConflitResponse {
  @ApiProperty({
    description: '실패 내용',
    examples: {
      example1: 'Already approved and rejected',
      example2: 'The application has already been reflected',
      example3: 'The user is not the author',
    },
  })
    message: string;

  @ApiProperty({ description: 'http status', default: 'Conflict' })
    error: string;

  @ApiProperty({ description: 'http status code', default: 409 })
    statusCode: number;
}
