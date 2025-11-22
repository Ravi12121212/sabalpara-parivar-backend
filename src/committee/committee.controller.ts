import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

class CreateCommitteeDto { name!: string; members?: { memberName: string; post: string }[]; }
class AddMemberDto { memberName!: string; post!: string; }
class UpdateMemberDto { memberName!: string; post!: string; }

@Controller('committees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommitteeController {
  constructor(private service: CommitteeService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateCommitteeDto) {
    return this.service.create(dto.name, dto.members || []);
  }

  @Get()
  list() { return this.service.list(); }

  @Post(':id/members')
  @Roles('admin')
  add(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.service.addMember(id, dto);
  }

  @Patch(':id/members/:index')
  @Roles('admin')
  update(@Param('id') id: string, @Param('index') index: string, @Body() dto: UpdateMemberDto) {
    return this.service.updateMember(id, Number(index), dto);
  }

  @Delete(':id/members/:index')
  @Roles('admin')
  remove(@Param('id') id: string, @Param('index') index: string) {
    return this.service.removeMember(id, Number(index));
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
