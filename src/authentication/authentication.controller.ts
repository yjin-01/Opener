import {
  Controller,
  InternalServerErrorException,
  UnauthorizedException,
  Post,
  Body,
  SetMetadata,
  BadRequestException,
  NotFoundException,
  Res,
  Req,
  Logger,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { InvalidException } from 'src/user/exception/invalid.exception';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { plainToClass } from 'class-transformer';
import { UserTokenDto } from 'src/user/dto/user.token.dto';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { AuthenticationLoginRequest } from './swagger/authentication.login.request';
import { AuthenticationLoginResponse } from './swagger/authentication.login.response';
import { AuthenticationLoginBadrequest } from './swagger/authentication.login.badrequest';
import { LoginDto } from './dto/login.dto';
import { AuthenticationValidationPipe } from './authentication.validtion.pipe';
import { AuthenticationGenerateTokenResponse } from './swagger/authentication.token.response';
import { InvalidEmailException } from './api/exception/InvalidEmailException';
import { NotExistException } from './exception/not.exist.exception';
import { AuthenticationLoginNotFound } from './swagger/authentication.login.notfound';
import { Cookie, CustomRequest } from './interface/Request';
import { GenerateTokenDto } from './dto/generate.token.dto';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('인증')
@Controller('/auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger('AuthController');

  @Public()
  @Post()
  @ApiOperation({
    summary: '로그인',
    description: '유저가 로그인을 합니다',
  })
  @ApiBody({ type: AuthenticationLoginRequest })
  @ApiCreatedResponse({
    description: '유저 정보를 반환합니다',
    type: AuthenticationLoginResponse,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: AuthenticationLoginBadrequest,
  })
  @ApiNotFoundResponse({
    description: '로그인하는 계정이 존재하지 않을 때 반환합니다',
    type: AuthenticationLoginNotFound,
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async signin(
    @Body(new AuthenticationValidationPipe()) loginDto: LoginDto,
      @Res({ passthrough: true }) res: Response,
  ): Promise<void | null> {
    try {
      this.logger.log(`In Signin ${loginDto}`);
      const user = await this.authenticationService.login(loginDto);
      const token = await this.authenticationService.generateTokenPair(user);

      res.cookie('accessToken', token.accessToken, {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/api',
        maxAge: 3600,
      });
      res.cookie('refreshToken', token.refreshToken, {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/api',
        maxAge: 3600 * 24 * 3000,
      });
      const result = plainToClass(UserDto, user);
      this.logger.debug(`In signin Return ${result}`);
      res.json(result);
    } catch (err) {
      this.logger.error('In Signin ', err);
      if (
        err instanceof InvalidEmailException
        || err instanceof InvalidException
      ) {
        throw new BadRequestException(err);
      } else if (
        err instanceof NotExistException
        || err instanceof NotExistException
      ) {
        throw new NotFoundException(err);
      }
      throw new InternalServerErrorException(err);
    }
  }

  @Public()
  @Delete()
  @ApiOperation({
    summary: '로그아웃',
    description: '유저가 로그아웃 합니다',
  })
  @ApiOkResponse({
    description: '쿠키가 제거됩니다.',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: AuthenticationLoginBadrequest,
  })
  @ApiNotFoundResponse({
    description: 'API url이 다를 경우 반환합니다',
    type: AuthenticationLoginNotFound,
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<void | null> {
    try {
      res.cookie('accessToken', {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/api',
        maxAge: 0,
      });
    } catch (err) {
      this.logger.error(`In logout error ${err}`);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('/token')
  @ApiOperation({
    summary: 'API accessToken 발급',
    description: '새로운 API accessToken이 발행됩니다',
  })
  @ApiCreatedResponse({
    description: 'API 토큰이 발급되었을 때 반환합니다',
    type: AuthenticationGenerateTokenResponse,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: AuthenticationLoginBadrequest,
  })
  @Public()
  async generateToken(
    @Body() body: GenerateTokenDto,
      @Req() req: CustomRequest,
      @Res({ passthrough: true }) res: Response,
  ): Promise<void | null> {
    try {
      // TODO 리팩터링
      this.logger.debug(
        `In generateToken request cookie:${req.headers.cookie}`,
      );

      if (!req.headers.cookie) {
        this.logger.error('not has cookie in headers');
        throw new UnauthorizedException();
      }

      const cookie = req.headers.cookie.split(';').reduce((acc, str) => {
        const [key, value] = str.replace(' ', '').split('=');
        acc[key] = value;
        return acc;
      }, {}) as Cookie;

      if (!cookie.refreshToken) {
        this.logger.error('not has refreshToken in cookie');
        throw new UnauthorizedException();
      }

      const tokenOwner = await this.jwtService.verifyAsync(
        cookie.refreshToken,
        {
          secret: this.configService.get('REFRESH_SECRET'),
        },
      );
      this.logger.debug(`token owner:${tokenOwner.userId}`);

      if (body.userId !== tokenOwner.userId) {
        this.logger.error(
          `userId:${body.userId}, userIdInToken:${tokenOwner.userId}`,
        );
        throw new JsonWebTokenError('not same user and token');
      }

      const accessToken = await this.authenticationService.generateToken(cookie);
      this.logger.debug(`new accessToken:${accessToken}`);
      const user = await this.userService.getUserById(tokenOwner.userId);

      res.cookie('accessToken', accessToken, {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/api',
        maxAge: 3600,
      });

      res.cookie('refreshToken', cookie.refreshToken, {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/api',
      });
      const result = plainToClass(UserTokenDto, user);
      this.logger.debug(`response body:${(result.email, result.signupMethod)}`);
      res.json(result);
    } catch (err) {
      this.logger.error(`In generate error:${err}`);
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException(err);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
