import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

type Cookie = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      console.log(request.cookie);
      const token = this.extractTokenFromHeader(request);
      const cookie = this.extractTokenFromCookie(request) as Cookie;

      let payload;

      if (token) {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('ACCESS_SECRET'),
        });

        request.user = payload;
        return true;
      }

      if (cookie.accessToken) {
        payload = await this.jwtService.verifyAsync(cookie.accessToken, {
          secret: this.configService.get('ACCESS_SECRET'),
        });

        request.user = payload;
        return true;
      }

      throw new UnauthorizedException();
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): Cookie | {} {
    return (
      request.headers.cookie?.split(';').reduce((acc, str) => {
        const [key, value] = str.replace(' ', '').split('=');
        acc[key] = value;
        return acc;
      }, {}) || {}
    );
  }
}
