import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    username?: string;
  
    @IsOptional()
    @IsNotEmpty()
    email?: string;
  
    @IsOptional()
    @IsNotEmpty()
    password?: string;
  
    @IsOptional()
    @IsNotEmpty()
    //@IsPhoneNumber()
    tel?: string;
  }
  