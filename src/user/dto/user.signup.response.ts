import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserSignupResponse {
  @ApiProperty({
    description: '회원 가입된 유저 아이디',
    default: '9293e343-ea1f-43',
  })
  @Expose()
    userId: string;

  @ApiProperty({ description: '회원 가입된 유저 이름', default: 'test' })
  @Expose()
    username: string;

  @ApiProperty({
    description: '회원 가입된 유저 이메일',
    default: 'test@test.com',
  })
  @Expose()
    email: string;

  @ApiProperty({ description: '회원 가입 유저 별명', default: 'p1z7' })
  @Expose()
    alias: string;

  @ApiProperty({
    description: '회원 가입된 유저 이미지 url',
    default: 'http://image.co.kr',
  })
  @Expose()
    profileImage: string;
}
