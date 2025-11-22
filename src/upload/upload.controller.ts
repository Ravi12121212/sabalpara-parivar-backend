import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    const dest = join(process.cwd(), 'public', 'result');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file uploaded' };
    const publicUrl = `/public/result/${file.filename}`;
    return {
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: publicUrl,
    };
  }
}
