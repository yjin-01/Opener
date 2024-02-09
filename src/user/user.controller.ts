import {
  Controller,
  InternalServerErrorException,
  Post,
  Body,
  BadRequestException,
  SetMetadata,
  Get,
  Query,
  Patch,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenDto } from 'src/authentication/dto/token.dto';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { UserService } from './user.service';
import { UserValidationPipe } from './user.validtion.pipe';
import { UserSignupRequest } from './swagger/user.signup.request';
import { UserSignupResponse } from './swagger/user.signup.response';
import { UserBadRequest } from './swagger/user.badrequest';
import { UserSignupDto } from './dto/user.signup.dto';
import { ExistException } from './exception/exist.exception';
import { InvalidException } from './exception/invalid.exception';
import { UserNicknameResponse } from './swagger/user.nickname.response';
import { UserUpdateProfileDto } from './dto/user.update.profile.dto';
import { UserProfileUpdateRequest } from './swagger/user.profile.update.request';
import { UserPasswordUpdateRequest } from './swagger/user.password.update.request';
import { UserUpdatePasswordDto } from './dto/user.update.password';

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
    type: UserBadRequest,
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
    type: UserBadRequest,
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

  @Patch('/:userId/profile')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'profile 수정',
    description: '유저 profile을 수정합니다',
  })
  @ApiBody({ type: UserProfileUpdateRequest })
  @ApiOkResponse({
    description: 'profile이 수정되었을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiNotFoundResponse({
    description: '유저가 없을 때 반환 합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async updateMyProfile(
    @Param('userId') userId: string,
      @Body(new UserValidationPipe()) userUpdateDto: UserUpdateProfileDto,
  ): Promise<number | undefined> {
    try {
      return await this.userService.updateProfile(userUpdateDto, userId);
    } catch (error) {
      if (error instanceof InvalidException) {
        throw new BadRequestException(error);
      }
      if (error instanceof NotExistException) {
        throw new NotFoundException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('/:userId/password')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '패스워드 수정',
    description: '유저 패스워드를 수정합니다',
  })
  @ApiBody({ type: UserPasswordUpdateRequest })
  @ApiOkResponse({
    description: '비밀번호가 변경되었을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: '토큰 없이 요청하였을 때 반환합니다',
  })
  @ApiNotFoundResponse({
    description: '유저가 없을 때 반환 합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버에서 처리할 수 없을 때 반환합니다',
  })
  async updateMyPassword(
    @Param('userId') userId: string,
      @Body(new UserValidationPipe()) userUpdateDto: UserUpdatePasswordDto,
  ): Promise<number | undefined> {
    try {
      return await this.userService.updatePassword(userUpdateDto, userId);
    } catch (error) {
      if (error instanceof InvalidException) {
        throw new BadRequestException(error);
      }
      if (error instanceof NotExistException) {
        throw new NotFoundException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }
}
