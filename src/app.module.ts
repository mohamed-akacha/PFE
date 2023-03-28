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
import { InspectionUnitModule } from './inspection-unit/inspection-unit.module';
import { InspectionUnitEntity } from './inspection-unit/entities/inspection-unit.entity';
import { InstitutionModule } from './institution/institution.module';
import { BlocModule } from './bloc/bloc.module';
import { InstitutionEntity } from './institution/entities/institution.entity';
import { BlocEntity } from './bloc/entities/bloc.entity';
import { AdminSeed } from './admin.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    //  load: [appConfig]
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host:process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    autoLoadEntities: true,
      entities: [UserEntity,InspectionEntity,EvaluationPointEntity,
        EvaluationEntity,InspectionUnitEntity,InstitutionEntity,BlocEntity],
        
      //__dirname + '/**/*.entity{.ts,.js}'
      synchronize: true,
      debug: false
    }),
    UserModule,
    InspectionModule,
    EvaluationPointModule,
    EvaluationModule,
    InspectionUnitModule,
    InstitutionModule,
    BlocModule,
    ],
  controllers: [AppController],
  providers: [AppService,AdminSeed],
})
export class AppModule {}
