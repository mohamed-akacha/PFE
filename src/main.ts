import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
   //validation pipe
  app.useGlobalPipes(new ValidationPipe({
    // retire tout les champs qui ne sont pas déclaré dans la dto
    whitelist: true,
    // rejette les requêtes qui contiennent des champs non déclaré dans la dto
    forbidNonWhitelisted: true, 
    //
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  })); 
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
