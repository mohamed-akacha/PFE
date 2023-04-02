import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BlocEntity } from 'src/bloc/entities/bloc.entity';
import { EvaluationPointEntity } from 'src/evaluation-point/entities/evaluation-point.entity';
import { InspectionEntity } from 'src/inspection/entites/inspection.entity';


export class EvaluationDataDto {
  @IsNotEmpty()

  inspection: InspectionEntity;

  @IsNotEmpty()

  blocs: BlocEntity[];

  @IsNotEmpty()

  criteria: EvaluationPointEntity[];
}
