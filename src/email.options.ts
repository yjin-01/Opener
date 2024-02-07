import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) => ({
  transport: `smtps://${configService.get('EMAIL')}:${configService.get('EMAIL_PASSWORD')}@smtp.gmail.com`,
  defaults: {
    from: '"email verification" <no-reply@opener.com>',
  },
});
