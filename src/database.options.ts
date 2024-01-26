import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (configService: ConfigService): TypeOrmModuleOptions => {
  console.log(configService.get('DATABASE_DIRECT'));
  return {
    type: configService.get('DATABASE_DIRECT'),
    host: configService.get('DATABASE_HOST'),
    port: Number(configService.get('DATABASE_PORT')),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE'),
    entities: [configService.get('ENTITIES')],
    logging: true,
    poolSize: Number(configService.get('POOL_SIZE')),
  } as TypeOrmModuleOptions;
};
