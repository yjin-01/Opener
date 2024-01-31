import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserValidationPipe } from './user.validtion.pipe';
import { UserSignupRequest } from './swagger/user.signup.request';
import { UserSignupResponseInterceptor } from './user.signup.response.interceptor';
import { UserSignupResponse } from './swagger/user.signup.response';
import { UserSignupBadRequest } from './swagger/user.signup.badrequest';
import { UserSignupDto } from './dto/user.signup.dto';

@ApiTags('유저')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(UserSignupResponseInterceptor)
  @Post()
  @ApiOperation({
    summary: '회원 가입',
    description: '새로운 회원 정보가 추가됩니다',
  })
  @ApiBody({ type: UserSignupRequest })
  @ApiCreatedResponse({
    description: '유저가 생성되었을 때 반환합니다',
    type: UserSignupResponse,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserSignupBadRequest,
  })
  async signUp(
    @Body(new UserValidationPipe()) userSignupDto: UserSignupDto,
  ): Promise<any | null> {
    try {
      return await this.userService.createUser(userSignupDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
