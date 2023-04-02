import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginCredentialsDto {

  @ApiProperty({
    description: 'The email of the user',
    format: 'email',
    minLength: 5,
    maxLength: 255,
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;

}
