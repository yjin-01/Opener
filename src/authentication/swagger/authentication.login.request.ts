import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthenticationLoginRequest {
  @ApiPropertyOptional({
    description: 'oauth2.0에 사용할 code',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QTOk6yJV_adQssw5c',
  })
    code: string;

  @ApiPropertyOptional({
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
