import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class UserSubscribeDto {
  
  @ApiProperty({
    description: 'The username of the user',
    minLength: 4,
    maxLength: 20,
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  username: string;
  
  @ApiProperty({
    description: 'The email address of the user',
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional()
  email: string;
  
  @ApiProperty({
    description: 'The telephone number of the user',
    minLength: 10,
    maxLength: 20,
    example: '+1-541-754-3010',
  })

  @IsString()
  //@IsPhoneNumber()
  @IsOptional()
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
  
  @ApiProperty({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'Abcd1234!',
  })

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;
}
