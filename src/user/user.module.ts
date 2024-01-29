import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryImple } from './user.repository.impl';

@Module({
  controllers: [UserController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    UserService,
  ],
})
export default class UserModule {}
