import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  BadRequestException,
  SetMetadata,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TokenDto } from 'src/authentication/dto/token.dto';
import { UserService } from './user.service';
import { UserValidationPipe } from './user.validtion.pipe';
import { UserSignupRequest } from './swagger/user.signup.request';
import { UserSignupResponse } from './swagger/user.signup.response';
import { UserSignupBadRequest } from './swagger/user.signup.badrequest';
import { UserSignupDto } from './dto/user.signup.dto';
import { ExistException } from './exception/exist.exception';
import { InvalidException } from './exception/invalid.exception';
import { UserNicknameResponse } from './swagger/user.nickname.response';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('유저')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('/nickname')
  @ApiOperation({
    summary: 'nickname 중복 확인',
    description: 'nickname이 중복인지 확인합니다',
  })
  @ApiQuery({
    name: 'search',
    description: '중복인지 확인하는 닉네임',
    example: '민정사랑해',
  })
  @ApiOkResponse({
    description: '닉네임 중복 결과를 반환합니다',
    type: UserNicknameResponse,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserSignupBadRequest,
  })
  async checkDuplicatedNickname(
    @Query('search') search: string,
  ): Promise<UserNicknameResponse | null> {
    try {
      return await this.userService.isDuplicatedNickname(search);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
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
  ): Promise<TokenDto | null> {
    try {
      return await this.userService.createUser(userSignupDto);
    } catch (error) {
      if (error instanceof InvalidException) {
        throw new BadRequestException(error);
      }
      if (error instanceof ExistException) {
        throw new BadRequestException(error);
      }
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
