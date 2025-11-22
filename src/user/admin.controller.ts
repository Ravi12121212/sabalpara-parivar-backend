import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly users: UserService) {}

  @Get('users')
  @Roles('admin')
  async listUsers() {
    const data = await this.users.listAllForAdmin();
    return { users: data }; // returning object form
  }
}