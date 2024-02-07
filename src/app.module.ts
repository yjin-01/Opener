import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseOption from './database.options';
import UserModule from './user/user.module';
import EventModule from './event/event.module';
import AuthenticationModule from './authentication/authentication.module';
import GroupModule from './group/group.module';
import ArtistModule from './artist/artist.module';
import { FileModule } from './file/file.module';
import ReviewModule from './review/review.module';
import { EmailModule } from './email/email.module';
import emailOptions from './email.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/config/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: DatabaseOption,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: emailOptions,
    }),
    EventModule,
    UserModule,
    AuthenticationModule,
    ArtistModule,
    GroupModule,
    FileModule,
    ReviewModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
