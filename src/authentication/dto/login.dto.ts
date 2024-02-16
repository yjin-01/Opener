import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  code: string;

  @IsOptional()
    email: string;

  signinMethod: string;

  @Transform(({ value }) => String(value))
  @IsOptional()
    password: string;

  isKakao(): boolean {
    return this.signinMethod === 'kakao';
  }

  isGoogle(): boolean {
    return this.signinMethod === 'google';
  }

  isOpener(): boolean {
    return this.signinMethod === 'opener';
  }

  isNaver(): boolean {
    return this.signinMethod === 'naver';
  }

  getCode(): string {
    return this.code;
  }

  getEmail(): string {
    return this.email;
  }
}
