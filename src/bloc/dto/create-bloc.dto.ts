import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateBlocDto {
    @IsNotEmpty()
    @IsString()
    code: string;
  
    @IsNotEmpty()
    @IsString()
    nom: string;
  
    @IsNotEmpty()
    @IsInt()
    @Min(0)A
    etage: number;
  
    @IsNotEmpty()
    @IsInt()
    inspectionUnitId: number;
}
