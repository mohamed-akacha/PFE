import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationModule } from 'src/evaluation/evaluation.module';
import { InspectionModule } from 'src/inspection/inspection.module';
import { EvaluationPointEntity } from './entities/evaluation-point.entity';
import { EvaluationPointController } from './evaluation-point.controller';
import { EvaluationPointService } from './evaluation-point.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([EvaluationPointEntity]),

  ],
  controllers: [EvaluationPointController],
  providers: [EvaluationPointService]
})
export class EvaluationPointModule {}
