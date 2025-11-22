import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsPhoneNumber('IN')
  @IsOptional()
  phone!: string; // Example: "+91 98765-43210"

  @IsString()
  @MinLength(6)
  password!: string;
}
