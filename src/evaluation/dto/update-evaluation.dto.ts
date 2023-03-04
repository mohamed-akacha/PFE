
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateEvaluationDto {
  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNotEmpty()
  pieceJointe?: string;
}
