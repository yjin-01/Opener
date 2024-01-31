import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    AuthenticationService,
  ],
})
export default class AuthenticationModule {}
