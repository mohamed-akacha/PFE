import { PartialType } from '@nestjs/swagger';
import { CreateContratDto } from './create-contrat.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate, IsNumber, IsPositive, IsInt } from 'class-validator';

export class UpdateContratDto extends PartialType(CreateContratDto) {
    @ApiProperty({
        description: 'La nouvelle date de début du contrat',
        example: '2023-03-22',
        required: false,
      })
      @IsOptional()
      @IsDate()
      date_debut?: Date;
    
      @ApiProperty({
        description: 'La nouvelle durée du contrat en mois',
        example: 6,
        required: false,
      })
      @IsOptional()
      @IsNumber()
      @IsPositive()
      duree?: number;
    
      @ApiProperty({
        description: "L'ID de la nouvelle institution pour laquelle le contrat est établi",
        example: 1,
        required: false,
      })
      @IsOptional()
      @IsInt()
      @IsPositive()
      institutionId?: number;
    
      @ApiProperty({
        description: "L'ID du nouveau sous-traitant avec lequel le contrat est établi",
        example: 3,
        required: false,
      })
      @IsOptional()
      @IsInt()
      @IsPositive()
      sousTraitantId?: number;
}
