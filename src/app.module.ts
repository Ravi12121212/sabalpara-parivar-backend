import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { CollectionsInitService } from './common/collections-init.service';
import { UploadModule } from './upload/upload.module';
import { CommitteeModule } from './committee/committee.module';
import { PreviousYearResultModule } from './previous-result/previous-year-result.module';
import { GalleryModule } from './gallery/gallery.module';
import { MongooseDatabaseModule } from './database/mongoose.module';

@Module({
  imports: [MongooseDatabaseModule, AuthModule, ProfileModule, UserModule, HealthModule, UploadModule, CommitteeModule, PreviousYearResultModule, GalleryModule],
  providers: [CollectionsInitService],
})
export class AppModule {}
