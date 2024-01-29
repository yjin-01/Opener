import { Injectable } from '@nestjs/common';
import { GoogleApi } from './google';
import { KakaoApi } from './kakao';
import { UserInformationApi } from './interface/userinformation.api';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class UserInformationApiFactory {
  static getApi(loginDto: LoginDto): UserInformationApi {
    if (loginDto.isGoogle()) {
      return new GoogleApi(loginDto);
    }
    return new KakaoApi(loginDto);
  }
}
