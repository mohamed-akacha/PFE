import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty({
    description: 'Le nom de l\'institution',
    example: 'Université de Paris',
    required: true,
  })
   nom: string;

  @ApiProperty({
    description: 'L\'adresse de l\'institution',
    example: '5 Rue de l\'Université, 75007 Paris, France',
    required: true,
  })
  adresse: string;

  @ApiProperty({
    description: 'La nature de l\'institution',
    example: 'hôpital ',
    required: true,
  })
   nature: string;

   @ApiProperty({
    example: '1',
    description: 'L\'ID de la zone  à laquelle l\'institution appartient',
    required: true,
  })
  @IsInt()
  zoneId: number;  
}
