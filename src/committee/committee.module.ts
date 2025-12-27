import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Committee, CommitteeSchema } from '../schemas/committee.schema';
import { CommitteeService } from './committee.service';
import { CommitteeController } from './committee.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Committee.name, schema: CommitteeSchema }])],
  controllers: [CommitteeController],
  providers: [CommitteeService],
  exports: [CommitteeService],
})
export class CommitteeModule {}
