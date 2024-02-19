import { Request } from 'express';

export type Cookie = {
  accessToken: string;
  refreshToken: string;
};

type User = {
  id: string;
};

export interface CustomRequest extends Request {
  user: User;
  cookie: Cookie;
}
