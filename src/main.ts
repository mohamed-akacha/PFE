import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yamljs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

dotenv.config(); // charge les variables d'environnement du fichier .env

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // crée l'application Nest

  // ValidationPipe global : valide les DTOs reçus en entrée des controllers
  app.useGlobalPipes(new ValidationPipe({
    // retire tous les champs qui ne sont pas déclarés dans la DTO
    whitelist: true,
    // rejette les requêtes qui contiennent des champs non déclarés dans la DTO
    forbidNonWhitelisted: true, 
    transform: true, // convertit les types des champs de la DTO si possible
    transformOptions: {
      enableImplicitConversion: true // permet la conversion automatique de types
    }
  }));

  // Middleware pour ajouter le token JWT dans le header Authorization
  app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    next();
  });

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Inspections')
    .setDescription('The inspection API description')
    .setVersion('1.0')
    .addTag('inspections')
    .addBearerAuth() // ajoute le support de l'authentification JWT
    .build();
  
  const options: SwaggerDocumentOptions =  {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey // nomme les opérations Swagger avec le nom de la méthode du controller
  };
  
  const document = SwaggerModule.createDocument(app, config, options); // crée la documentation Swagger

  fs.writeFileSync("./swagger.yaml", yaml.stringify(document)); // enregistre la documentation au format YAML dans un fichier
  SwaggerModule.setup('api', app, document); // expose la documentation Swagger à l'URL /api

  app.useStaticAssets(join(__dirname, '..', 'public')); // sert les fichiers statiques (images, CSS, JS, etc.) du dossier public
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // définit le dossier de base pour les vues (templates)
  app.setViewEngine('hbs'); // définit le moteur de rendu pour les vues (Handlebars)
  
  await app.listen(process.env.APP_PORT || 3000); // démarre l'application sur le port spécifié dans le fichier .env, ou sur le port 3000 par défaut
}

bootstrap();
