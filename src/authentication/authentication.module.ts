import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { APP_GUARD } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './authentication.guard';

@Module({
  imports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    UserService,
  ],
})
export default class AuthenticationModule {}
