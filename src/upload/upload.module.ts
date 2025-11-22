import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { PreviousResultUploadController } from './previous-result-upload.controller';

@Module({
  controllers: [UploadController, PreviousResultUploadController],
})
export class UploadModule {}
