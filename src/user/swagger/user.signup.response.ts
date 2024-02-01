import { ApiProperty } from '@nestjs/swagger';

export class UserSignupResponse {
  @ApiProperty({
    description: '새로 발급한 API token',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
    accessToken: string;

  @ApiProperty({
    description: 'token 재발급에 필요한 refreshToken',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hYyBEb25hbGQiLCJpYXQiOjE1MTYyMzkwMjJ9.vcN3FbITYDKyPmz3R_eKXbfQ_YuVBuGR3fLodhHqLh8',
  })
    refreshToken: string;
}
