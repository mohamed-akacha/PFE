import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationPointModule } from 'src/evaluation-point/evaluation-point.module';
import { InspectionModule } from 'src/inspection/inspection.module';
import { EvaluationEntity } from './entities/evaluation.entity';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([EvaluationEntity]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService]
})
export class EvaluationModule {}
