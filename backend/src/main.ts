import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { createCorsOriginValidator, getAllowedOrigins } from './config/cors';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const clientUrl = configService.get<string>('CLIENT_URL');
  const allowedOrigins = getAllowedOrigins(clientUrl);
  const port = configService.get<number>('PORT') || 3001;

  app.enableCors({
    origin: createCorsOriginValidator(allowedOrigins),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
};

bootstrap();
