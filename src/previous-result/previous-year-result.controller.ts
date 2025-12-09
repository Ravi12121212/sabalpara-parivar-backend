 import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { PreviousYearResultService } from "./previous-year-result.service";
import { CreatePreviousYearResultDto } from "./dto/create-previous-year-result.dto";

@Controller("previous-results")
export class PreviousYearResultController {
  constructor(private readonly service: PreviousYearResultService) {}

  @Post()
  async create(@Body() dto: CreatePreviousYearResultDto) {
    const saved = await this.service.create(dto);
    return { ok: true, result: saved };
  }

  // SET IMAGE URL
  @Post("image")
  async setImage(@Body() body: { id: string; url: string }) {
    const { id, url } = body;

    if (!id || !url) {
      return { ok: false, message: "id and url are required" };
    }

    const updated = await this.service.setImageUrl(id, url);
    return { ok: !!updated, result: updated };
  }

  // LIST ALL
  @Get()
  async list() {
    const results = await this.service.list();
    return { results };
  }

  // TEST ROUTE
  @Get("hello")
  async hello() {
    const results = await this.service.list();
    return { results };
  }

  // DELETE
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const ok = await this.service.remove(id);
    return { ok };
  }
}
