import { Injectable } from '@nestjs/common';
import { request } from 'node:https';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import * as qs from 'qs';
import { UserInformationApi } from './interface/userinformation.api';
import { LoginDto } from '../dto/login.dto';
import { InvalidEmailException } from './exception/InvalidEmailException';
import { NaverResultDto } from '../dto/naver.result.dto';

type Token = {
  access_token: string;
  refrsh_token: string;
  expireIn: number;
};

@Injectable()
export class NaverApi implements UserInformationApi {
  constructor(
    private readonly loginDto: LoginDto,
    private readonly configService: ConfigService,
  ) {}

  getUserInfo(accessToken: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'openapi.naver.com',
        path: '/v1/nid/me',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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

  request(): Promise<Token | null> {
    return new Promise((resolve, reject) => {
      const query = qs.stringify({
        client_id: this.configService.get('NAVER_CLIENT'),
        client_secret: this.configService.get('NAVER_CLIENT_SECRET'),
        grant_type: 'authorization_code',
        state: '1234',
        code: this.loginDto.getCode(),
      });

      const options = {
        hostname: 'nid.naver.com',
        path: `/oauth2.0/token?${query}`,
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
    if (!userInfo.access_token) {
      throw new InvalidEmailException('invalid Email');
    }
  }

  async getTokenInfo(): Promise<NaverResultDto | null> {
    try {
      const tokens = await this.request();
      this.isValid(tokens);
      const userInfo = await this.getUserInfo(tokens!.access_token);
      return plainToInstance(NaverResultDto, userInfo.response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
