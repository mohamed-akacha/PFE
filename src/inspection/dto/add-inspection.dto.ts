import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDate, IsBoolean, IsInt } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';
import { ApiProperty } from '@nestjs/swagger';


export class AddInspectionDto {


  @ApiProperty({
    description: 'La description de l\'inspection',
    example: 'Vérification de l\'état de la chaudière',
    required: true,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'La date prévue de l\'inspection',
    example: '2023-04-01',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  datePrevue: Date;

  @ApiProperty({
    description: 'Le type d\'inspection',
    enum: InspectionType,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

  @ApiProperty({
    description: 'L\'identifiant de l\'inspecteur en charge de l\'inspection',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  inspecteurId?: number;

  @ApiProperty({
    description: 'L\'identifiant de l\'unité à inspecter',
    example: 2,
    required : false 
  })
  @IsInt()
  @IsOptional()
  unitId: number;
}
