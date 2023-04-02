import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yamljs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
   //validation pipe
  app.useGlobalPipes(new ValidationPipe({
    // retire tout les champs qui ne sont pas déclaré dans la dto
    whitelist: true,
    // rejette les requêtes qui contiennent des champs non déclaré dans la dto
    forbidNonWhitelisted: true, 
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  })); 
  app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    next();
  });
  const config = new DocumentBuilder()
    .setTitle('Inspections')
    .setDescription('The inspection API description')
    .setVersion('1.0')
    .addTag('inspections')
    .addBearerAuth()
    .build();
    const options: SwaggerDocumentOptions =  {
     
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };
  const document = SwaggerModule.createDocument(app, config, options);

  fs.writeFileSync("./swagger.yaml", yaml.stringify(document));
  SwaggerModule.setup('api', app, document);
  app.useStaticAssets(join(__dirname, '..', 'public')); // serve static files from the public folder
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // set the base directory for templates
  app.setViewEngine('hbs');
  await app.listen(process.env.APP_PORT || 3000); 
}
bootstrap();
