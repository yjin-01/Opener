import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationGenerateTokenResponse {
  @ApiProperty({
    description: '유저 이메일',
    default: 'opener@opener.com',
  })
    email: string;

  @ApiProperty({
    description: '유저가 가입한 경로',
    default: 'opener',
  })
    signupMethod: string;
}
