import { plainToInstance } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRepositoryImple } from 'src/user/user.repository.impl';
import { Test } from '@nestjs/testing';
import { NotExistException } from 'src/email/exception/not.exist.exception';
import { EmailVerification } from 'src/email/entity/email.verifications.entity';
import { InvalidException } from 'src/user/exception/invalid.exception';
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
    find: null,
    update: null,
  });

  const mockService = () => ({
    sendMail: null,
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

    emailRepository.find = jest.fn().mockResolvedValue(null);

    await expect(
      emailService.verificateEmail(verificationEmailDto),
    ).rejects.toThrow(new NotExistException('not exist verification record'));
  });

  test('이메일 인증 시간이 끝났을 때 InvalidException을 발생시킨다', async () => {
    emailRepository = moduleRef.get('EmailRepository');
    mailerService = moduleRef.get('MailerService');
    userRepository = moduleRef.get('UserRepository');

    const verificationEmailDto = plainToInstance(VerificationEmailDto, {
      email: 'test@test.com',
      verificationNumber: '123456',
    });
    const verificationRecord = plainToInstance(EmailVerification, {
      createdAt: Date.now(),
    });

    emailRepository.find = jest.fn().mockResolvedValue(verificationRecord);
    emailService = new EmailService(
      userRepository,
      mailerService,
      emailRepository,
    );
    await expect(
      emailService.verificateEmail(verificationEmailDto),
    ).rejects.toThrow(InvalidException);
  });

  test('이메일 인증 번호가 다를 때 InvalidException을 발생시킨다', async () => {
    emailRepository = moduleRef.get('EmailRepository');
    mailerService = moduleRef.get('MailerService');
    userRepository = moduleRef.get('UserRepository');

    const verificationEmailDto = plainToInstance(VerificationEmailDto, {
      email: 'test@test.com',
      verificationNumber: '123456',
    });
    const verificationRecord = plainToInstance(EmailVerification, {
      createdAt: Date.now(),
      key: '12345',
    });
    emailRepository.find = jest.fn().mockResolvedValue(verificationRecord);
    emailService = new EmailService(
      userRepository,
      mailerService,
      emailRepository,
    );
    await expect(
      emailService.verificateEmail(verificationEmailDto),
    ).rejects.toThrow(InvalidException);
  });

  test('이메일 인증 조건이 맞을 때 업데이트된 로우 수를 반환한다', async () => {
    emailRepository = moduleRef.get('EmailRepository');
    mailerService = moduleRef.get('MailerService');
    userRepository = moduleRef.get('UserRepository');

    const verificationEmailDto = plainToInstance(VerificationEmailDto, {
      email: 'test@test.com',
      verificationNumber: '123456',
    });
    const current = new Date();
    current.setHours(current.getHours() + 9);
    const verificationRecord = plainToInstance(EmailVerification, {
      createdAt: current,
      key: '123456',
    });

    emailRepository.find = jest.fn().mockResolvedValue(verificationRecord);
    emailRepository.update = jest.fn().mockResolvedValue(1);
    emailService = new EmailService(
      userRepository,
      mailerService,
      emailRepository,
    );

    await expect(
      emailService.verificateEmail(verificationEmailDto),
    ).resolves.toBe(1);
  });
});
