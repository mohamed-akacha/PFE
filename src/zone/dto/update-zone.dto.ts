import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateZoneDto } from './create-zone.dto';

export class UpdateZoneDto extends PartialType(CreateZoneDto) {
    @ApiPropertyOptional({
        description: 'Nom de la zone',
        example: "sfax",
        required: false
    })
    nom?: string;
}
