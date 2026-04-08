import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import 'dotenv/config';
import * as yaml from 'yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  try {
    const filePath = join(process.cwd(), 'doc', 'api.yaml');
    const file = readFileSync(filePath, 'utf8');
    const document = yaml.parse(file) as OpenAPIObject;
    SwaggerModule.setup('doc', app, document);
  } catch (e) {
    console.error('Swagger file not found or invalid');
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 Swagger documentation: http://localhost:${port}/doc`);
}
bootstrap();
