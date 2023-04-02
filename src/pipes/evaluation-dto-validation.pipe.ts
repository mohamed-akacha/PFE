import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { CreateEvaluationDto } from 'src/evaluation/dto/create-evaluation.dto';

@Injectable()
export class EvaluationDtoValidationPipe implements PipeTransform {
  transform(evaluationDtos: CreateEvaluationDto[]) {
    const validationErrors = evaluationDtos.map(dto => validateSync(dto));
    const errors = validationErrors.reduce((acc, curr) => acc.concat(curr), []);
    console.log(evaluationDtos);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return evaluationDtos;
  }
}
