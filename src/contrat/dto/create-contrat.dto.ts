import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsPositive, IsNotEmpty, IsInt } from 'class-validator';

export class CreateContratDto {
  @ApiProperty({
    description: 'La date de début du contrat',
    example: '2023-03-22',
  })
  @IsNotEmpty()
  @IsDate()
  date_debut: Date;

  @ApiProperty({
    description: 'La durée du contrat en mois',
    example: 12,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duree: number;

  @ApiProperty({
    description: "L'ID de l'institution pour laquelle le contrat est établi",
    example: 1,
  })
  @IsNotEmpty()
   @IsInt()
  @IsPositive()
  institutionId: number;

  @ApiProperty({
    description: "L'ID du sous-traitant avec lequel le contrat est établi",
    example: 2,
  })
  @IsNotEmpty()
   @IsInt()
  @IsPositive()
  sousTraitantId: number;
}

