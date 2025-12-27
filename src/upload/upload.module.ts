import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { PreviousResultUploadController } from './previous-result-upload.controller';
import { CommitteeMemberUploadController } from './committee-member-upload.controller';

@Module({
  controllers: [UploadController, PreviousResultUploadController, CommitteeMemberUploadController],
})
export class UploadModule {}
