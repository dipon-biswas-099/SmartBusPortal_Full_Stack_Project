import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    credentials: true,
  });

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, '..', 'uploads', 'nid');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Serve static files for NID images
  app.use('/uploads/nid', require('express').static(uploadDir));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
  }));

  await app.listen(process.env.PORT ?? 3004);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
