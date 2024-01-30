import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseOption from './database.options';
import UserModule from './user/user.module';
import EventModule from './event/event.module';
import AuthenticationModule from './authentication/authentication.module';
import GroupModule from './group/group.module';
import ArtistModule from './artist/artist.module';

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
    EventModule,
    UserModule,
    AuthenticationModule,
    ArtistModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
