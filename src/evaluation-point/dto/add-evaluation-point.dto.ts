import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddEvaluationPointDto {

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsString()
  pieceJointe?: string;

}
