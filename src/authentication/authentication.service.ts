import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/interface/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UserInformationApiFactory } from './api/userinformation.factory';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenPair(user): Promise<TokenDto | null> {
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

  async generateToken(tokens): Promise<string | null> {
    try {
      const user = await this.jwtService.verifyAsync(tokens.refreshToken, {
        secret: this.configService.get('REFRESH_SECRET'),
      });
      return await this.jwtService.signAsync(
        { userId: user.id, username: user.username },
        { secret: this.configService.get('ACCESS_SECRET') },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async login(loginDto: LoginDto): Promise<any | null> {
    try {
      const tokenInfo = await UserInformationApiFactory.getApi(loginDto).getTokenInfo();
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
