import {
  Controller,
  InternalServerErrorException,
  UnauthorizedException,
  Post,
  Body,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { AuthenticationLoginRequest } from './swagger/authentication.login.request';
import { AuthenticationLoginResponse } from './swagger/authentication.login.response';
import { AuthenticationLoginBadrequest } from './swagger/authentication.login.badrequest';
import { LoginDto } from './dto/login.dto';
import { AuthenticationValidationPipe } from './authentication.validtion.pipe';
import { AuthenticationGenerateTokenRequest } from './swagger/authentication.token.request';
import { TokenDto } from './dto/token.dto';
import { InvalidEmailException } from './api/exception/InvalidEmailException';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('인증')
@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: '로그인',
    description: '새로운 API 토큰이 발행됩니다',
  })
  @ApiBody({ type: AuthenticationLoginRequest })
  @ApiCreatedResponse({
    description: 'API 토큰이 발급되었을 때 반환합니다',
    type: AuthenticationLoginResponse,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: AuthenticationLoginBadrequest,
  })
  async signin(
    @Body(new AuthenticationValidationPipe()) loginDto: LoginDto,
  ): Promise<null> {
    try {
      return await this.authenticationService.login(loginDto);
    } catch (err) {
      if (err instanceof InvalidEmailException) {
        throw new BadRequestException(err);
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
