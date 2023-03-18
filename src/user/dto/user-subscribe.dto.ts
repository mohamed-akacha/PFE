import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class UserSubscribeDto {

  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
 // @IsPhoneNumber()
  @IsString()
  tel: string;

 @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsNotEmpty()
  password: string;
}
