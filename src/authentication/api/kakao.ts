import { Injectable } from '@nestjs/common';
import { request } from 'node:https';

@Injectable()
export class KakaoApi {
  async requestGoogleOauth(accessToken): Promise<any | null> {
    try {
      return await new Promise((resolve, reject) => {
        const options = {
          hostname: 'kapi.kakao.com',
          path: '/v2/user/me',
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
          res.on('end', () => {
            resolve(JSON.parse(result));
          });
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.end();
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  isValid(userInfo): void {
    if (!userInfo?.kakao_account?.is_email_verified) {
      console.log(userInfo);
      throw new Error();
    }
  }

  async getTokenInfo(accessToken): Promise<any | null> {
    const userInfo = await this.requestGoogleOauth(accessToken);
    this.isValid(userInfo);
    return userInfo;
  }
}
