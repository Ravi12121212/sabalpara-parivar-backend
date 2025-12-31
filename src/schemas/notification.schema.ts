import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class NotificationItem extends Document {
  @Prop()
  text?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  createdAt!: Date;
}

export const NotificationItemSchema = SchemaFactory.createForClass(NotificationItem);
NotificationItemSchema.index({ text: 'text' });
