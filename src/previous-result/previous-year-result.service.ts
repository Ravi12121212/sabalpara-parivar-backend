import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreviousYearResult } from './previous-year-result.schema';
import { CreatePreviousYearResultDto } from './dto/create-previous-year-result.dto';

@Injectable()
export class PreviousYearResultService {
  constructor(@InjectModel(PreviousYearResult.name) private model: Model<PreviousYearResult>) {}

  async create(dto: CreatePreviousYearResultDto) {
    const doc = new this.model(dto);
    await doc.save();
    return doc;
  }

  async list(limit = 1000) {
    return this.model.find().sort({ createdAt: -1 }).limit(limit);
  }

  async remove(id: string) {
    const res = await this.model.deleteOne({ _id: id });
    return res.deletedCount === 1;
  }

  async setImageUrl(id: string, url: string | undefined) {
    if (!url) return null;
    return this.model.findByIdAndUpdate(
      { _id: id },
      { $set: { resultFileUrl: url } },
      { new: true }
    );
  }
}
