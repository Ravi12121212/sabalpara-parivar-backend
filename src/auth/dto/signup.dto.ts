import { IsEmail, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsPhoneNumber('IN')
  phone!: string; // Example: "+91 98765-43210"

  @IsString()
  @MinLength(6)
  password!: string;
}
