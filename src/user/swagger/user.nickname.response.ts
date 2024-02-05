import { ApiProperty } from '@nestjs/swagger';

export class UserNicknameResponse {
  @ApiProperty({ description: '중복 여부', default: 'false' })
    isDuplicated: boolean;
}
