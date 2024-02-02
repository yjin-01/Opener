import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthenticationLoginRequest {
  @ApiPropertyOptional({
    description: '클라이언트에서 인증한 토큰',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
    accessToken: string;

  @ApiProperty({
    description: '클라이언트에서 인증한 이메일',
    default: 'test@test.com',
  })
    email: string;

  @ApiProperty({
    description: '로그인한 SNS',
    default: 'google',
  })
    signinMethod: string;

  @ApiPropertyOptional({
    description: '계정 비밀번호',
    default: '12345678',
  })
    password: string;
}
