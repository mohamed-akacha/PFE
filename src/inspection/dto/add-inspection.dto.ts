import { IsNotEmpty, IsBoolean, IsDateString, IsEnum, IsNumber, IsArray, IsOptional } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';
import { UserEntity } from 'src/user/entities/user.entity';

export class AddInspectionDto {

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  datePrevue: Date;

  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

  @IsNumber()
  @IsOptional()
  inspecteurId?: number; // le champ inspecteur est facultatif

}
