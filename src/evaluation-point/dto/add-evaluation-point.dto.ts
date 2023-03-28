import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';

export class AddEvaluationPointDto {

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

 /*  @IsOptional()
  @IsNumber()
  score?: number;

  @IsString()
  pieceJointe?: string; */

}
