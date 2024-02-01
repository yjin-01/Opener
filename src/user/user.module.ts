import { Module } from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryImple } from './user.repository.impl';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    { provide: 'AuthenticationService', useClass: AuthenticationService },
    UserService,
  ],
})
export default class UserModule {}
