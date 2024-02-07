import { ApiProperty } from '@nestjs/swagger';

export class EmailSendRequest {
  @ApiProperty({ description: '이메일', default: 'test@test.com' })
    email: string;
}
