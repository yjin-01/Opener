import { IsOptional } from 'class-validator';

export class LoginDto {
  code: string;

  @IsOptional()
    email: string;

  signinMethod: string;

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
