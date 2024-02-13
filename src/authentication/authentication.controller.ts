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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { JsonWebTokenError } from '@nestjs/jwt';
import { InvalidException } from 'src/user/exception/invalid.exception';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { plainToClass } from 'class-transformer';
import { AuthenticationService } from './authentication.service';
import { AuthenticationLoginRequest } from './swagger/authentication.login.request';
import { AuthenticationLoginResponse } from './swagger/authentication.login.response';
import { AuthenticationLoginBadrequest } from './swagger/authentication.login.badrequest';
import { LoginDto } from './dto/login.dto';
import { AuthenticationValidationPipe } from './authentication.validtion.pipe';
import { AuthenticationGenerateTokenRequest } from './swagger/authentication.token.request';
import { TokenDto } from './dto/token.dto';
import { InvalidEmailException } from './api/exception/InvalidEmailException';
import { NotExistException } from './exception/not.exist.exception';
import { AuthenticationLoginNotFound } from './swagger/authentication.login.notfound';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('인증')
@Controller('/auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

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
  ): Promise<UserDto | null> {
    try {
      const user = await this.authenticationService.login(loginDto);
      const token = await this.authenticationService.generateTokenPair(user);

      res.appendHeader(
        'Set-Cookie',
        `accessToken=${token!.accessToken}; Secure; HttpOnly`,
      );
      res.appendHeader(
        'Set-Cookie',
        `refreshToken=${token!.refreshToken}; Secure; HttpOnly`,
      );

      return plainToClass(UserDto, user);
    } catch (err) {
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
  @Post('/token')
  @ApiOperation({
    summary: 'API accessToken 발급',
    description: '새로운 API accessToken이 발행됩니다',
  })
  @ApiBody({ type: AuthenticationGenerateTokenRequest })
  @ApiCreatedResponse({
    description: 'API 토큰이 발급되었을 때 반환합니다',
    type: AuthenticationLoginResponse,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: AuthenticationLoginBadrequest,
  })
  async generateToken(
    @Body(new AuthenticationValidationPipe()) tokenDto: TokenDto,
  ): Promise<string | null> {
    try {
      return await this.authenticationService.generateToken(tokenDto);
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException(err);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
