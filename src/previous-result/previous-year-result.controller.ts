import { Body, Controller, Get, Post } from '@nestjs/common';
import { PreviousYearResultService } from './previous-year-result.service';
import { CreatePreviousYearResultDto } from './dto/create-previous-year-result.dto';

// Public controller: no auth guard applied
@Controller('previous-results')
export class PreviousYearResultController {
  constructor(private readonly service: PreviousYearResultService) {}

  @Post()
  async create(@Body() dto: CreatePreviousYearResultDto) {
    const saved = await this.service.create(dto);
    return { ok: true, result: saved };
  }

  @Get()
  async list() {
    const results = await this.service.list();
    return { results };
  }
}
