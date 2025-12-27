import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { User } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body('identifier') identifier: string) {
    return this.auth.forgotPassword(identifier);
  }

  @Post('reset-password')
  resetPassword(@Body('token') token: string, @Body('password') password: string) {
    return this.auth.resetPassword(token, password);
  }

  @UseGuards(JwtAuthGuard)
  me(@User('sub') userId: string) {
    return this.auth.me(userId);
  }
}
