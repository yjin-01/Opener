import { Injectable } from '@nestjs/common';
import { request } from 'node:https';
import { UserInformationApi } from './interface/userinformation.api';
import { LoginDto } from '../dto/login.dto';
import { InvalidEmailException } from './exception/InvalidEmailException';

@Injectable()
export class KakaoApi implements UserInformationApi {
  constructor(private readonly loginDto: LoginDto) {}

  async getTokenInfo(): Promise<any | null> {
    const userInfo = await this.request();
    this.isValid(userInfo);
    return userInfo;
  }

  async request(): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'kapi.kakao.com',
        path: '/v2/user/me',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginDto.getAccessToken()}`,
        },
      };

      const req = request(options, (res) => {
        let result = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          result += chunk;
        });
        res.on('end', () => resolve(JSON.parse(result)));
      });

      req.on('error', reject);

      req.end();
    });
  }

  isValid(userInfo): void {
    console.log(userInfo);
    if (!userInfo?.kakao_account?.is_email_verified) {
      throw new InvalidEmailException('kakao account not verified');
    }
  }
}
