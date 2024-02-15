import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
    origin: ['http://localhost:3000'],
    credentials: true,
<<<<<<< HEAD
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'PUT', 'HEAD', 'OPTIONS'],
  });

=======
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'PUT'],
  });
>>>>>>> 719e748 (merge pull request (#209))
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, swaggerOptions);
  await app.listen(3000);
}

bootstrap();
