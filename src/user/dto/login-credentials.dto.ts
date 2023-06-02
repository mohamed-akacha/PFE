import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginCredentialsDto {

  @ApiProperty({
    description: 'The email of the user',
    format: 'email',
    minLength: 5,
    maxLength: 255,
    example: 'admin@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'admin123',
  })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  deviceToken: string;

}
