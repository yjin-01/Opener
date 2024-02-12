import { IsEmail } from 'class-validator';

export class LoginDto {
  code: string;

  @IsEmail()
    email: string;

  signinMethod: string;

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

  getCode(): string {
    return this.code;
  }

  getEmail(): string {
    return this.email;
  }
}
