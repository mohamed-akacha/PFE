import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSousTraitantDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      description: "Nom du contact du sous-traitant",
    })
    nom_contact: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      description: "Numéro de téléphone du contact du sous-traitant",
    })
    tel_contact: string;
  
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
      description: "Adresse email du contact du sous-traitant",
    })
    email_contact: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      description: "Raison sociale du sous-traitant",
    })
    raison_sociale: string;
  
  
}
