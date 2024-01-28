import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { AuthenticationLoginRequest } from './dto/authentication.login.request';
import { AuthenticationLoginResponse } from './dto/authentication.login.response';
import { AuthenticationLoginBadrequest } from './swagger/authentication.login.badrequest';

@ApiTags('인증')
@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

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
  signin(@Body() loginRequest: AuthenticationLoginRequest): Promise<null> {
    try {
      return this.authenticationService.login(loginRequest);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
