import { PartialType } from '@nestjs/mapped-types';
import { CreateInstitutionDto } from './create-institution.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateInstitutionDto extends PartialType(CreateInstitutionDto) {
    @ApiProperty({
        description: 'Nom de l\'institution',
        example: 'Université de Paris',
        required: false,
    })
    @IsOptional()
    @IsString()
    nom?: string;

    @ApiProperty({
        description: 'Adresse de l\'institution',
        example: '5 Rue Thomas Mann, 75013 Paris',
        required: false,
    })
    @IsOptional()
    @IsString()
    adresse?: string;

    @ApiProperty({
        description: 'Nature de l\'institution',
        example: 'hôpital',
        required: false,
    })
    @IsOptional()
    @IsString()
    nature?: string;

}
