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

  getAccessToken(): string {
    return this.accessToken;
  }
}
