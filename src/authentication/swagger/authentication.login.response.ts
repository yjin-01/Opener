import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationLoginResponse {
  @ApiProperty({
    description: '로그인한 유저 아이디',
    default:
      'eyJhbGciOiJIUzI1NiIsICI6IkpXVCJ9.eyJzdWIiOiIxMjM0NkpvjM5MDIyfQ.SflKxwRJSMeKKf36POk6yJV_adQssw5c',
  })
    userId: string;

  @ApiProperty({
    description: '로그인한 유저의 닉네임',
    default: 'p1z7',
  })
    nickName: string;

  @ApiProperty({
    description: '로그인한 유저의 프로필 이미지',
    default: 'http://image.co.kr',
  })
    profileImage: string;
}
