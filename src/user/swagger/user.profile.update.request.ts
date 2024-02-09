import { ApiProperty } from '@nestjs/swagger';

export class UserProfileUpdateRequest {
  @ApiProperty({ description: '수정하려는 닉네임', default: 'p1z7' })
    nickName: string;
}
