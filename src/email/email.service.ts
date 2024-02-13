import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from 'src/user/interface/user.repository';
import * as moment from 'moment';
import { InvalidException } from 'src/user/exception/invalid.exception';
import { EmailRepository } from './email.repository';
import { EmailVerification } from './entity/email.verifications.entity';
import { EmailExistException } from './exception/email.exist.exception';
import { NotExistException } from './exception/not.exist.exception';

@Injectable()
export class EmailService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly emailRepository: EmailRepository,
  ) {}

  private generateRandom() {
    return Math.floor(Math.random() * 89999) + 10000;
  }

  async send(user): Promise<number | null> {
    try {
      const account = await this.userRepository.findBy(user);

      if (account) {
        throw new EmailExistException('already exist email');
      }

      const key = this.generateRandom();
      const result = await this.emailRepository.log(
        plainToInstance(EmailVerification, { email: user.email, key }),
      );
      await this.mailerService.sendMail({
        to: user.email,
        from: '"email verification" <no-reply@opener.com>',
        subject: 'opener signup email ✔',
        text: 'input key',
        html: `<b>${key}</b>`,
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private isMatch(request, original) {
    return request.verificationNumber === original.key;
  }

  private isTimeOver(original) {
    try {
      const originalMoment = moment(original.createdAt).subtract('hours', 9);
      const nowMoment = moment(Date.now());
      return moment.duration(nowMoment.diff(originalMoment)).asMinutes() > 10;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verificateEmail(verificationDto): Promise<number | undefined> {
    const original = await this.emailRepository.find(verificationDto);

    if (!original) {
      throw new NotExistException('not exist verification record');
    }

    if (this.isTimeOver(original)) {
      throw new InvalidException('verification time is over');
    }

    if (!this.isMatch(verificationDto, original)) {
      throw new InvalidException('not equal verification number');
    }
    return this.emailRepository.update(original);
  }
}
