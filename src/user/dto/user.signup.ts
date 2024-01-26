import {
  IsUrl, IsOptional, IsString, IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSignupDto {
  @ApiProperty({ description: '회원 가입 유저 이름', default: 'test' })
  @IsString()
    userName: string;

  // TODO enum으로 리팩터링
  @ApiPropertyOptional({ description: '회원 가입 종류', default: 'google' })
  @IsOptional()
    signupMethod: string;

  @ApiProperty({ description: '이메일', default: 'test@test.com' })
  @IsEmail()
    email: string;

  @ApiPropertyOptional({ description: '가입한 유저 닉네임', default: 'p1z7' })
  @IsOptional()
    alias: string;

  @ApiPropertyOptional({
    description: '가입한 유저 이미지 url',
    default: 'http://image.co.kr',
  })
  @IsOptional()
  @IsUrl()
    profileImage: string;
}
