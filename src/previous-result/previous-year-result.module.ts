import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreviousYearResult, PreviousYearResultSchema } from './previous-year-result.schema';
import { PreviousYearResultService } from './previous-year-result.service';
import { PreviousYearResultController } from './previous-year-result.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: PreviousYearResult.name, schema: PreviousYearResultSchema }])],
  controllers: [PreviousYearResultController],
  providers: [PreviousYearResultService],
})
export class PreviousYearResultModule {}
