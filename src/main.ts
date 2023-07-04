import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import * as yaml from 'js-yaml';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

import { AppModule } from './app.module';
import { BaseRequestMiddleware, Configuration } from './common';

async function bootstrap() {
  const envs = Configuration.envs();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: envs.loggingLevel,
      transports: new winston.transports.Console(),
    }),
  });

  if (envs.environment === 'Development') {
    const config = new DocumentBuilder()
      .setTitle('Open Banking With Plaid Context')
      .setDescription('TOpen Banking API')
      .setVersion('2.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const { writeFile } = await import('fs/promises');
    await writeFile('./swagger-spec.json', JSON.stringify(document));
    await writeFile('./openapi-run.yaml', yaml.dump(document));
    SwaggerModule.setup('/swagger', app, document);
  }
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  app.use(new BaseRequestMiddleware().use);
  await app.listen(envs.port);
}

bootstrap();
