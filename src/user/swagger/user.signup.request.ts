import { IsOptional, IsEmail, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSignupRequest {
  @ApiProperty({ description: '회원 가입 유저 이름', default: 'test' })
  @IsOptional()
    userName: string;

  // TODO enum으로 리팩터링
  @ApiPropertyOptional({ description: '회원 가입 종류', default: 'google' })
  @IsOptional()
    signupMethod: string;

  @ApiProperty({ description: '이메일', default: 'test@test.com' })
  @IsEmail()
    email: string;

  @ApiProperty({ description: '패스워드', default: '패스워드8자이상' })
  @Length(8, 20)
    password: string;

  @ApiProperty({ description: '패스워드 확인', default: '패스워드8자이상' })
  @Length(8, 20)
    passwordCheck: string;

  @ApiPropertyOptional({ description: '가입한 유저 닉네임', default: 'p1z7' })
  @IsOptional()
    nickName: string;

  @ApiPropertyOptional({
    description: '내가 좋아하는 아티스트 아이디',
    default: ['13ea2845-69ed-47', '4dd6af2f-616e-42', '5c6141ab-cf30-48'],
  })
  @IsOptional()
    myArtists: string[] | [];
}
