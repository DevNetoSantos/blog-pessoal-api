import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = 8000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('Docs Blog')
  .setDescription('BLOG - E aplicação formato para blog pessoal.')
  .setVersion('1.0')
  .addTag('posts')
  .addTag('categories')
  .addTag('auth')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log(`server running in http://localhost:${port}`);
}
bootstrap();
