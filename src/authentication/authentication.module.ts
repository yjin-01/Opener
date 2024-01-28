import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { GoogleApi } from './api/google';
import { KakaoApi } from './api/kakao';

@Module({
  imports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    { provide: 'GoogleApi', useClass: GoogleApi },
    { provide: 'KakaoApi', useClass: KakaoApi },
    AuthenticationService,
  ],
})
export default class AuthenticationModule {}
