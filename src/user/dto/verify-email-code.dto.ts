import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerityEmailCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verifycode : string;
}