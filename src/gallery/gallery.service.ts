import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryItem } from '../schemas/gallery.schema';

export interface CreateGalleryItemDto {
  imageUrl: string;
  title?: string;
}
export interface CreateGalleryItemInput {
  imageUrl: string;
  title?: string;
}

@Injectable()
export class GalleryService {
  constructor(@InjectModel(GalleryItem.name) private model: Model<GalleryItem>) {}

  private escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async list(q?: string): Promise<any[]> {
    const term = (q ?? '').toString().trim();
    const effective = term && term.toLowerCase() !== 'null' && term.toLowerCase() !== 'undefined' ? term : '';
    // No query: return latest
    if (!effective) {
      const items = await this.model.find().sort({ createdAt: -1 }).exec();
      return items.map((i) => i.toObject());
    }
    // Always use case-insensitive substring match on title and imageUrl
    const rx = new RegExp(this.escapeRegex(effective), 'i');
    const items = await this.model
      .find({ $or: [{ title: rx }, { imageUrl: rx }] } as any)
      .sort({ createdAt: -1 })
      .exec();
    return items.map((i) => i.toObject());
  }

  async create(dto: CreateGalleryItemDto): Promise<any> {
    const item = await this.model.create({ imageUrl: dto.imageUrl, title: dto.title });
    return item.toObject();
  }

  async createMany(items: CreateGalleryItemInput[]): Promise<any[]> {
    if (!items?.length) return [];
    const created = await this.model.insertMany(items.map(i => ({ imageUrl: i.imageUrl, title: i.title })));
    return created.map(i => i.toObject());
  }

  async remove(id: string): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Item not found');
  }
}
