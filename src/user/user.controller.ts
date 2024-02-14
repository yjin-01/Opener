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
  Delete,
  Inject,
  Res,
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
  ApiParam,
} from '@nestjs/swagger';
import { NotExistException } from 'src/authentication/exception/not.exist.exception';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
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
import { FollowDto } from './dto/follow.dto';
import { FollowRequest } from './swagger/follow.request';
import { FollowArtist } from './dto/follow.artist.dto';
import { FollowArtistResponse } from './swagger/follow.artist.response';
import { UserDto } from './dto/user.dto';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('유저')
@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('AuthenticationService')
    private readonly authService: AuthenticationService,
  ) {}

  @Get('/:userId/artists')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '팔로우 아티스트 조회',
    description: '팔로우한 아티스트 목록을 불러옵니다',
  })
  @ApiParam({
    name: 'userId',
    description: '유저 아이디',
    type: 'uuid',
    example: 'f14ab7e7-ee5c-4707-b68e-ddb6cf8b0f00',
  })
  @ApiOkResponse({
    description: '아티스트 팔로우가 조회되었을 때 반환합니다',
    type: FollowArtistResponse,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: 'token 없이 요청하였을 때 반환합니다',
  })
  @ApiNotFoundResponse({
    description: '계정이 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버가 처리할 수 없을 때 반환합니다',
  })
  async getFollowArtists(
    @Param('userId') userId: string,
  ): Promise<FollowArtist[] | null> {
    try {
      return await this.userService.getMyArtistList(userId);
    } catch (error) {
      if (error instanceof NotExistException) {
        throw new NotFoundException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('/:userId/artists')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '팔로우 아티스트 삭제',
    description: '아티스트 팔로우를 취소합니다',
  })
  @ApiParam({
    name: 'userId',
    description: '유저 아이디',
    type: 'uuid',
    example: 'f14ab7e7-ee5c-4707-b68e-ddb6cf8b0f00',
  })
  @ApiBody({
    type: FollowRequest,
  })
  @ApiOkResponse({
    description: '아티스트 팔로우가 취소되었을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: 'token 없이 요청하였을 때 반환합니다',
  })
  @ApiNotFoundResponse({
    description: '계정이 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버가 처리할 수 없을 때 반환합니다',
  })
  async deleteFollowArtist(
    @Param('userId') userId: string,
      @Body(new UserValidationPipe()) followDto: FollowDto,
  ): Promise<number | null> {
    try {
      return await this.userService.unfollowArtist(userId, followDto);
    } catch (error) {
      if (error instanceof NotExistException) {
        throw new NotFoundException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/:userId/artists')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '아티스트 팔로우',
    description: '아티스트를 팔로우합니다',
  })
  @ApiParam({
    name: 'userId',
    description: '유저 아이디',
    type: 'uuid',
    example: 'f14ab7e7-ee5c-4707-b68e-ddb6cf8b0f00',
  })
  @ApiBody({
    type: FollowRequest,
  })
  @ApiCreatedResponse({
    description: '아티스트가 추가되었을 때 반환합니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body, param, query 값들이 일치하지 않을 때)',
    type: UserBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: 'token 없이 요청하였을 때 반환합니다',
  })
  @ApiNotFoundResponse({
    description: '계정이 존재하지 않을 때 반환합니다',
  })
  @ApiInternalServerErrorResponse({
    description: '예외가 발생하여 서버가 처리할 수 없을 때 반환합니다',
  })
  async followArtist(
    @Param('userId') userId: string,
      @Body(new UserValidationPipe()) followDto: FollowDto,
  ): Promise<string | null> {
    try {
      return await this.userService.addArtist(userId, followDto);
    } catch (error) {
      if (error instanceof NotExistException) {
        throw new NotFoundException(error);
      }
      throw new InternalServerErrorException(error);
    }
  }

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
      @Res() res: Response,
  ): Promise<void | null> {
    try {
      const user = await this.userService.createUser(userSignupDto);
      const token = await this.authService.generateTokenPair(user);

      res.appendHeader(
        'Set-Cookie',
        `accessToken=${token!.accessToken}; Secure; HttpOnly`,
      );
      res.appendHeader(
        'Set-Cookie',
        `refreshToken=${token!.refreshToken}; Secure; HttpOnly`,
      );
      res.json(plainToInstance(UserDto, user));
    } catch (error) {
      if (error instanceof InvalidException) {
        throw new BadRequestException(error);
      }
      if (error instanceof ExistException) {
        throw new BadRequestException(error);
      }
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
