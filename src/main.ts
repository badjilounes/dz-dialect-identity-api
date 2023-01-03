import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: buildCorsOrigin(app) });

  const swaggerOptions = new DocumentBuilder()
    .setTitle('DzDialect Identity API')
    .setDescription('DzDialect Identity API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('openapi', app, document, {
    swaggerOptions: {
      displayRequestDuration: true,
      docExpansion: 'none',
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT || 3000);
}

function buildCorsOrigin(app: INestApplication): string[] {
  try {
    return JSON.parse(app.get(ConfigService).get('CORS_ORIGIN'));
  } catch {
    return [app.get(ConfigService).get('CORS_ORIGIN')];
  }
}

bootstrap();
