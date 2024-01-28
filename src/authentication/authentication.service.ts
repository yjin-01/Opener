import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/interface/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleOauth } from './api/google.oauth';
import { AuthenticationLoginRequest } from './dto/authentication.login.request';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('GoogleOauth') private readonly googleOauth: GoogleOauth,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenPair(user): Promise<object | null> {
    try {
      const accessToken = await this.jwtService.signAsync(
        { userId: user.id, username: user.username },
        { expiresIn: '1h', secret: this.configService.get('ACCESS_SECRET') },
      );
      const refreshToken = await this.jwtService.signAsync(
        { userId: user.id, username: user.username },
        { expiresIn: '30d', secret: this.configService.get('REFRESH_SECRET') },
      );
      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async login(loginDto: AuthenticationLoginRequest): Promise<any | null> {
    try {
      if (loginDto.signinMethod !== 'google') {
        throw new Error();
      }

      const tokenInfo = await this.googleOauth.getTokenInfo(
        loginDto.accessToken,
      );
      const user = await this.userRepository.findBy(tokenInfo);

      if (!user) {
        throw new Error();
      }

      return await this.generateTokenPair(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}