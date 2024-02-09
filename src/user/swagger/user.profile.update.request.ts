import { ApiProperty } from '@nestjs/swagger';

export class UserProfileUpdateRequest {
  @ApiProperty({ description: '수정하려는 닉네임', default: 'p1z7' })
    nickName: string;

  @ApiProperty({
    description: '수정하려는 이미지',
    default: 'http://image.com',
  })
    profileImage: string;
}
