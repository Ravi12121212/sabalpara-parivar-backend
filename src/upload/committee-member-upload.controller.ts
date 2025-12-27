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
    const dest = join(process.cwd(), 'public', 'committee-members');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

@Controller('committee-member-upload')
export class CommitteeMemberUploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    })
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file uploaded' };
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return { error: 'Only JPG/PNG/WEBP images allowed' };
    }
    const publicUrl = `/public/committee-members/${file.filename}`;
    return { filename: file.filename, mimetype: file.mimetype, size: file.size, url: publicUrl };
  }
}
