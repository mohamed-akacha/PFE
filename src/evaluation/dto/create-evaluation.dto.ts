import { IsNumber, IsString, IsOptional, IsNotEmpty, Max, Min, ValidatePromise } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEvaluationDto {
  @ApiProperty({
    description: 'ID de l\'inspection',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @ Min (1) 
  inspectionId: number;

  @ApiProperty({
    description: 'ID du bloc',
    example: 2,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @ Min (1) 
  blocId: number;

  @ApiProperty({
    description: 'ID du point d\'évaluation',
    example: 3,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @ Min (1) 
  evaluationPointId: number;

  @ApiProperty({
    description: 'Score de l\'évaluation',
    example: 8,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Le score doit être d\'au moins 0.' })
  @Max(10, { message: 'Le score doit être inférieur ou égal à 10.' })
  score: number;

  @ApiProperty({
    description: 'Pièce jointe de l\'évaluation',
    example: 'https://example.com/file.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  pieceJointe?: string;
}
