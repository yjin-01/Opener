import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserRepositoryImple } from './user.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EntityManager],
  controllers: [UserController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    UserService,
  ],
})
export default class UserModule {}
