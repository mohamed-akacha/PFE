import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class UpdateUserDto {
  
  @ApiProperty({
    description: 'The updated username of the user',
    minLength: 4,
    maxLength: 20,
    example: 'john_doe',
  })
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  username?: string;
  
  @ApiProperty({
    description: 'The updated email address of the user',
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  email?: string;
  
  @ApiProperty({
    description: 'The updated password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'Abcd1234!',
  })
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password?: string;

  @ApiProperty({
    description: 'The updated password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'Abcd1234!',
  })
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  oldpassword?: string;
  
  @ApiProperty({
    description: 'The updated telephone number of the user',
    minLength: 10,
    maxLength: 20,
    example: '+1-541-754-3010',
  })
  @IsOptional()
  @IsNotEmpty()
  // @IsPhoneNumber()
  @ApiPropertyOptional()
  tel?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRoleEnum,
    example: UserRoleEnum.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRoleEnum)
  @ApiPropertyOptional()
  role?: UserRoleEnum;
}
