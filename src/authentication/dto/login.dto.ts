import { IsEmail } from 'class-validator';

export class LoginDto {
  accessToken: string;

  @IsEmail()
    email: string;

  signinMethod: string;

  isKakao(): boolean {
    return this.signinMethod === 'kakao';
  }

  isGoogle(): boolean {
    return this.signinMethod === 'google';
  }

  isOpener(): boolean {
    return this.signinMethod === 'opener';
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
