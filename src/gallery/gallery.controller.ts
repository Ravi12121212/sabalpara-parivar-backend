import { Controller, Get, Post, Body, Delete, Param, UseGuards, UploadedFile, UploadedFiles, UseInterceptors, Query } from '@nestjs/common';
import { GalleryService, CreateGalleryItemDto, CreateGalleryItemInput } from './gallery.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const galleryStorage = diskStorage({
  destination: (req, file, cb) => {
    const dest = join(process.cwd(), 'public', 'gallery');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

@Controller('gallery')
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Get()
  async list(@Query('q') q?: string) {
    return this.service.list(q);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateGalleryItemDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }

  // Upload endpoint returns a URL to be used in create()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: galleryStorage,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file uploaded' };
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) return { error: 'Only JPG/PNG/WEBP images allowed' };
    const url = `/public/gallery/${file.filename}`;
    return { url, filename: file.filename, size: file.size, mimetype: file.mimetype };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('upload-many')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: galleryStorage,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) return { error: 'No files uploaded' };
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const result = files
      .filter((f) => allowed.includes(f.mimetype))
      .map((file) => ({
        url: `/public/gallery/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      }));
    return { items: result };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('bulk')
  async bulkCreate(@Body() body: { items: CreateGalleryItemInput[] }) {
    const created = await this.service.createMany(body.items || []);
    return created;
  }
}
