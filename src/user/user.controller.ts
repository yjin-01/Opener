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
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserValidationPipe } from './user.validtion.pipe';
import { UserSignupDto } from './dto/user.signup';
import { UserSignupResponseInterceptor } from './user.signup.response.interceptor';
import { UserSignupResponse } from './dto/user.signup.response';

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
  @ApiBody({ type: UserSignupDto })
  @ApiCreatedResponse({
    description: '유저를 생성한다.',
    type: UserSignupResponse,
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
