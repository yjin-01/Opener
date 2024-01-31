import { Injectable } from '@nestjs/common';
import { request } from 'node:https';
import { UserInformationApi } from './interface/userinformation.api';
import { LoginDto } from '../dto/login.dto';
import { InvalidEmailException } from './exception/InvalidEmailException';

@Injectable()
export class GoogleApi implements UserInformationApi {
  constructor(private readonly loginDto: LoginDto) {}

  request(): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.googleapis.com',
        path: `/oauth2/v1/userinfo?access_token=${this.loginDto.getAccessToken()}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
    if (!userInfo.verified_email) {
      throw new InvalidEmailException('invalid Email');
    }
  }

  async getTokenInfo(): Promise<any | null> {
    try {
      const userInfo = await this.request();
      this.isValid(userInfo);
      return userInfo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
