import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationGenerateTokenRequest {
  @ApiProperty({
    description: '백엔드에서 발급한 API accessToken',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
    accessToken: string;

  @ApiProperty({
    description: '백엔드에서 발급한 API refreshToken',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hYyBEb25hbGQiLCJpYXQiOjE1MTYyMzkwMjJ9.vcN3FbITYDKyPmz3R_eKXbfQ_YuVBuGR3fLodhHqLh8',
  })
    refreshToken: string;
}
