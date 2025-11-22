import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @Get()
  get(@User('sub') userId: string) {
    return this.profile.getFull(userId);
  }

  @Post()
  upsert(@User('sub') userId: string, @Body() dto: UpsertProfileDto) {
    return this.profile.upsert(userId, dto);
  }

  // List unique villages across all user profiles
  @Get('villages')
  listVillages() {
    return this.profile.listVillages();
  }
}
