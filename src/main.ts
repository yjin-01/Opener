import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API docs')
    .setDescription('The p1z7 API description.')
    .setVersion('1.0')
    .addTag('p1z7')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  console.log('hello world!!!!!!!!!');
  await app.listen(3000);
}

bootstrap();
