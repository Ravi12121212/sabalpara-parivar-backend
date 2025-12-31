import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationItem } from '../schemas/notification.schema';

export interface CreateNotificationDto {
  text?: string;
  imageUrl?: string;
}

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(NotificationItem.name) private model: Model<NotificationItem>) {}

  async list(): Promise<any[]> {
    const items = await this.model.find().sort({ createdAt: -1 }).exec();
    return items.map((i) => i.toObject());
  }

  async create(dto: CreateNotificationDto): Promise<any> {
    const item = await this.model.create({ text: dto.text, imageUrl: dto.imageUrl });
    return item.toObject();
  }

  async remove(id: string): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Notification not found');
  }
}
