import { Injectable } from '@nestjs/common';
import { request } from 'node:https';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InvalidException } from 'src/user/exception/invalid.exception';
import { UserInformationApi } from './interface/userinformation.api';
import { LoginDto } from '../dto/login.dto';
import { InvalidEmailException } from './exception/InvalidEmailException';

@Injectable()
export class KakaoApi implements UserInformationApi {
  constructor(
    private readonly loginDto: LoginDto,
    private readonly configService: ConfigService,
  ) {}

  async getTokenInfo(): Promise<any | null> {
    const { access_token: accessToken } = await this.requestToken();

    const userInfo = await this.getUser(accessToken);
    this.isValid(userInfo);
    return this.toUserInstance(userInfo);
  }

  toUserInstance(user) {
    return {
      email: user.kakao_account.email,
      nickName: user.kakao_account.profile.nickname,
      signupMethod: 'kakao',
    };
  }

  async requestToken(): Promise<any | null> {
    try {
      const requestUrl = 'https://kauth.kakao.com/oauth/token';

      const data = {};
      const response = await axios.post(requestUrl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: this.configService.get('KAKAO_CLIENT'),
          code: this.loginDto.code,
        },
      });
      return response.data;
    } catch (error) {
      throw new InvalidException(error.message);
    }
  }

  async getUser(token) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'kapi.kakao.com',
        path: '/v2/user/me',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
