import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import AppModule from './app.module';

// 새로고침해도 토큰 유지 옵션
const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true, // 캐시 사용 활성화
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API docs')
    .setDescription('The p1z7 API description.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        name: 'JWT',
        in: 'header',
      },
      'accessToken',
    )
    .addTag('p1z7')
    .build();
  app.enableCors({
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 744d8fa (fix: allow origin all (#273))
    // origin: [
    //   'http://localhost:3000',
    //   'localhost:3000',
    //   'https://myopener.kr',
    //   'myopener.kr',
    // ],
    origin: true,
<<<<<<< HEAD
=======
    origin: [
      'http://localhost:3000',
      'localhost:3000',
      'https://myopener.kr',
      'myopener.kr',
    ],
>>>>>>> ab210df (fix: origin 추가 (#271) (#272))
=======
>>>>>>> 744d8fa (fix: allow origin all (#273))
=======
    origin: ['http://localhost:3000', 'localhost:3000'],
>>>>>>> ef85026 (hotfix/image-upload)
    allowedHeaders: ['Authorization', 'Set-Cookie'],
    credentials: true,
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'PUT', 'HEAD', 'OPTIONS'],
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, swaggerOptions);

  await app.listen(3000);
}

bootstrap();
