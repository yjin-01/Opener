import { plainToInstance } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { Test } from '@nestjs/testing';
import { NotExistException } from 'src/email/exception/not.exist.exception';
import { EmailRepository } from '../../../src/email/email.repository';
import { EmailService } from '../../../src/email/email.service';
import { VerificationEmailDto } from '../../../src/email/dto/vefirication.dto';

describe('email.service verificateEmail 테스트', () => {
  let emailService: EmailService;
  let emailRepository: EmailRepository;
  let mailerService: MailerService;
  let userRepository: UserRepositoryImple;
  let moduleRef;

  const mockRepository = () => ({
    find: jest.fn(),
    update: jest.fn(),
  });

  const mockService = () => ({
    sendMail: jest.fn(),
  });

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        { provide: 'UserRepository', useValue: mockRepository() },
        { provide: 'MailerService', useValue: mockService() },
        { provide: 'EmailRepository', useValue: mockRepository() },
      ],
    }).compile();
  });

  test('이메일 발송 기록이 없을 때 NotExistException을 발생시킨다', async () => {
    emailRepository = moduleRef.get('EmailRepository');
    mailerService = moduleRef.get('MailerService');
    userRepository = moduleRef.get('UserRepository');

    const verificationEmailDto = plainToInstance(VerificationEmailDto, {
      email: 'test@test.com',
      verificationNumber: '123456',
    });
    emailService = new EmailService(
      userRepository,
      mailerService,
      emailRepository,
    );
    await expect(
      async () => emailService.verificateEmail(verificationEmailDto),
    ).rejects.toThrow(new NotExistException('not exist verification record'));
  });
});
