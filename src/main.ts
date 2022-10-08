import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import supertokensSwagger from './auth/swagger-supertokens.json';
import { SupertokensExceptionFilter } from './auth/auth-supertokens.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.use(cookieParser());

  // Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Quiz-Lore Public API')
    .setVersion('1.0')
    .addSecurity('sAccessToken', {
      type: 'apiKey',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'sAccessToken'
    })
    .addSecurity('sIdRefreshToken', {
      type: 'apiKey',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'sIdRefreshToken'
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  if (swaggerDocument.tags) {
    swaggerDocument.tags = [...supertokensSwagger.tags, ...swaggerDocument.tags];
  }
  if (swaggerDocument.components) {
    swaggerDocument.components.schemas = {
      ...(supertokensSwagger.components.schemas as any),
      ...swaggerDocument.components.schemas
    };
  }
  swaggerDocument.paths = { ...(supertokensSwagger.paths as any), ...swaggerDocument.paths };
  SwaggerModule.setup('swagger', app, swaggerDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      filter: true,
      docExpansion: 'none'
    }
  });
  const config = app.get<ConfigService>(ConfigService);
  const cors = config.get('cors');
  app.enableCors(cors);
  const port = config.get('port');
  app.useGlobalFilters(new SupertokensExceptionFilter());
  await app.listen(port);
}
bootstrap();
