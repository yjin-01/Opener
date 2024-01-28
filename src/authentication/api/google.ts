import { Injectable } from '@nestjs/common';
import { request } from 'node:https';

@Injectable()
export class GoogleApi {
  async requestGoogleOauth(accessToken): Promise<any | null> {
    try {
      return await new Promise((resolve, reject) => {
        const options = {
          hostname: 'www.googleapis.com',
          path: `/oauth2/v1/userinfo?access_token=${accessToken}`,
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
          res.on('end', () => {
            console.log('No more data in response.');
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
    if (!userInfo.verified_email) {
      throw new Error();
    }
  }

  async getTokenInfo(accessToken): Promise<any | null> {
    const userInfo = await this.requestGoogleOauth(accessToken);
    this.isValid(userInfo);
    return userInfo;
  }
}
