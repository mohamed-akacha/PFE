import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateEvaluationDto } from 'src/evaluation/dto/create-evaluation.dto';

@Injectable()
export class EvaluationDtoValidationPipe implements PipeTransform {
  async transform(evaluationDtos: CreateEvaluationDto[]) {
    const validationErrors = await validate(evaluationDtos);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }
    return evaluationDtos;
  }
}
