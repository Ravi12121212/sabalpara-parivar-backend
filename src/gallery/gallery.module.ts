import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GalleryItem, GalleryItemSchema } from '../schemas/gallery.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: GalleryItem.name, schema: GalleryItemSchema }])],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
