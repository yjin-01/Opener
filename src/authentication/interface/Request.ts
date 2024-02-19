import { Request } from 'express';

export type Cookie = {
  accessToken: string;
  refreshToken: string;
};

export interface CustomRequest extends Request {
  user: object;
  cookie: Cookie;
}
