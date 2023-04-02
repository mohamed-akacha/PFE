import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSousTraitantDto } from './create-sous-traitant.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSousTraitantDto extends PartialType(CreateSousTraitantDto) {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nouveau nom du contact du sous-traitant",
    })
    nom_contact?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nouveau numéro de téléphone du contact du sous-traitant",
    })
    tel_contact?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({
        description: "Nouvelle adresse email du contact du sous-traitant",
    })
    email_contact?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Nouvelle raison sociale du sous-traitant",
    })
    raison_sociale?: string;
}
