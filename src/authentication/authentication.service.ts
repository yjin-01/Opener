import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/user/interface/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { isMatch } from 'src/user/utils/encrypt';
import { InvalidException } from 'src/user/exception/invalid.exception';
import { plainToInstance } from 'class-transformer';
import { UserSignupDto } from 'src/user/dto/user.signup.dto';
import { User } from 'src/user/entity/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserInformationApiFactory } from './api/userinformation.factory';
import { TokenDto } from './dto/token.dto';
import { NotExistException } from './exception/not.exist.exception';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger: Logger = new Logger('AuthService');

  async generateTokenPair(user): Promise<TokenDto> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { userId: user.id, username: user.username },
          { expiresIn: '1h', secret: this.configService.get('ACCESS_SECRET') },
        ),
        this.jwtService.signAsync(
          { userId: user.id, username: user.username },
          {
            expiresIn: '30d',
            secret: this.configService.get('REFRESH_SECRET'),
          },
        ),
      ]);
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

  async login(loginDto: LoginDto): Promise<User | null> {
    try {
      // TODO 리팩터링
      if (loginDto.isOpener()) {
        const opener = await this.userRepository.findBy(loginDto);

        if (!opener) {
          throw new NotExistException('not exist user');
        }

        if (!(await isMatch(loginDto.password, opener.password))) {
          throw new InvalidException('password not valid');
        }

        return opener;
      }

      const tokenInfo = await UserInformationApiFactory.getApi(
        loginDto,
        this.configService,
      ).getTokenInfo();
      this.logger.debug(tokenInfo);
      const user = await this.userRepository.findBy(tokenInfo);

      if (!user) {
        const newUser = await this.userRepository.create(
          plainToInstance(UserSignupDto, tokenInfo, {
            exposeDefaultValues: true,
          }),
        );
        return newUser;
      }

      if (user?.signupMethod !== loginDto.signinMethod) {
        throw new InvalidException('invalid signinMethod');
      }

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
