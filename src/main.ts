import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MiPichanga (Matches) - API')
    .setDescription(
      'API para la gestión de partidos en MiPichanga. Permite crear, actualizar y eliminar partidos, así como gestionar jugadores en cada partido.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('matches', 'Endpoints relacionados con la gestión de partidos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL.split(', '),
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
