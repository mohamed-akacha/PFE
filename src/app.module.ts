import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InspectionModule } from './inspection/inspection.module';
import { EvaluationPointModule } from './evaluation-point/evaluation-point.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './user/entities/user.entity';
import { InspectionEntity } from './inspection/entites/inspection.entity';
import { EvaluationPointEntity } from './evaluation-point/entities/evaluation-point.entity';
import { EvaluationEntity } from './evaluation/entities/evaluation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    //  load: [appConfig]
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:'localhost', //process.env.DB_HOST,
      port: 3306,//parseInt(process.env.DB_PORT),
      username: 'root',//process.env.DB_USERNAME,
      password: '',//process.env.DB_PASSWORD,
      database: 'checkUp',//process.env.DB_NAME,
      // autoLoadEntities: true,
      entities: [UserEntity,InspectionEntity,EvaluationPointEntity,EvaluationEntity],
     // synchronize: true,
      debug: false
    }),
    UserModule,
    InspectionModule,
    EvaluationPointModule,
    EvaluationModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
