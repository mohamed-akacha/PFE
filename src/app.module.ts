import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InspectionModule } from './inspection/inspection.module';
import { EvaluationPointModule } from './evaluation-point/evaluation-point.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',//process.env.DB_HOST,
      port: 3306, //parseInt(process.env.DB_PORT),
      username: 'root', //process.env.DB_USERNAME,
      password: '',// process.env.DB_PASSWORD,
      database: '',//process.env.DB_NAME,
      autoLoadEntities: true,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      debug: false
    }),
    InspectionModule,
    EvaluationPointModule,
    EvaluationModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
