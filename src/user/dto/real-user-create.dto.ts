import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class UserRSubscribeDto {  
  
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
    description: 'The role of the user',
    enum: UserRoleEnum,
    example: UserRoleEnum.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRoleEnum)
  @ApiPropertyOptional()
  role?: UserRoleEnum;
}
