import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class GalleryItem extends Document {
  @Prop({ required: true })
  imageUrl!: string;

  @Prop()
  title?: string;

  @Prop()
  createdAt!: Date;
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);
GalleryItemSchema.index({ title: 'text' });
