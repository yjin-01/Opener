import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationRequest {
  @ApiProperty({ description: '인증 요청하는 이메일' })
    email: string;

  @ApiProperty({ description: '발급 받은 인증번호' })
    verificationNumber: number;
}
