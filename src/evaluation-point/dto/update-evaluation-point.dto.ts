import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEvaluationPointDto {
  @ApiProperty({
    description: "La description de l'évaluation point à mettre à jour",
    example: "Nouvelle description de l'évaluation point"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    description: "Le type de l'inspection associé à l'évaluation point",
    example: InspectionType.Externe
  })
  @IsOptional()
  @IsEnum(InspectionType)
  @IsNotEmpty()
  type?: InspectionType;
}
