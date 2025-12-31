import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationItem, NotificationItemSchema } from '../schemas/notification.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: NotificationItem.name, schema: NotificationItemSchema }])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
