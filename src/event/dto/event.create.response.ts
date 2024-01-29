import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class EventCreateResponse {
  @ApiProperty({
    description: '회원 가입된 이벤트 아이디',
    default: '9293e343-ea1f-43',
  })
  @Expose()
    eventId: string;
}
