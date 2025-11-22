import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('by-village/:village')
  async byVillage(@Param('village') village: string) {
    const data = await this.users.listUsersByVillage(village);
    return { village, users: data };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.users.findByIdWithProfile(id);
  }

  @Patch(':id/promote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async promote(@Param('id') id: string) {
    return this.users.promoteToAdmin(id);
  }
}
