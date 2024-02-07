import { Module } from '@nestjs/common';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';

@Module({
  controllers: [EmailController],
  providers: [
    { provide: 'UserRepository', useClass: UserRepositoryImple },
    EmailRepository,
    EmailService,
  ],
})
export class EmailModule {}
