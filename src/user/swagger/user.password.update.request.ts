import { ApiProperty } from '@nestjs/swagger';

export class UserPasswordUpdateRequest {
  @ApiProperty({ description: '변경하려는 패스워드', default: 'p1z7' })
    password: string;

  @ApiProperty({ description: '변경하려는 패스워드 확인', default: 'p1z7' })
    passwordCheck: string;
}
