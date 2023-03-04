import { Module } from '@nestjs/common';
import { EvaluationPointController } from './evaluation-point.controller';
import { EvaluationPointService } from './evaluation-point.service';

@Module({
  controllers: [EvaluationPointController],
  providers: [EvaluationPointService]
})
export class EvaluationPointModule {}
