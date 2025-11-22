import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeedService {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onApplicationBootstrap() {
    const email = process.env.ADMIN_EMAIL;
    const phone = process.env.ADMIN_PHONE;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      this.logger.log('Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set');
      return;
    }
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      if ((existing as any).role !== 'admin') {
        await this.userModel.updateOne({ _id: existing._id }, { $set: { role: 'admin' } });
        this.logger.log(`Promoted existing user ${email} to admin.`);
      }
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await this.userModel.create({ email, phone: phone || email, passwordHash, role: 'admin' });
    this.logger.log(`Seeded admin user ${email}`);
  }
}