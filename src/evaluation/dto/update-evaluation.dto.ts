import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEvaluationDto {
  @ApiPropertyOptional({
    description: "Le score de l'évaluation. Doit être un nombre.",
    example: 8.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional({
    description: "Le nom du fichier attaché à l'évaluation.",
    example: 'mon_fichier.pdf',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  pieceJointe?: string;
}
