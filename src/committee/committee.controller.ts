import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { CommitteeService, CreateCommitteeDto, AddMemberDto, UpdateMemberDto } from './committee.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('committees')
export class CommitteeController {
  constructor(private readonly service: CommitteeService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateCommitteeDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.service.addMember(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/members/:index')
  async updateMember(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.service.updateMember(id, parseInt(index, 10), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/members/:index')
  async removeMember(@Param('id') id: string, @Param('index') index: string) {
    return this.service.removeMember(id, parseInt(index, 10));
  }
}
