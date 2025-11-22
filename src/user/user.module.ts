import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserProfile, UserProfileSchema } from '../schemas/user-profile.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminController } from './admin.controller';
import { AdminSeedService } from '../common/admin-seed.service';
import { FamilyMember, FamilyMemberSchema } from '../schemas/family-member.schema';

@Module({
		imports: [MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: UserProfile.name, schema: UserProfileSchema },
			{ name: FamilyMember.name, schema: FamilyMemberSchema },
		])],
		controllers: [UserController, AdminController],
		providers: [UserService, AdminSeedService],
		exports: [UserService],
})
export class UserModule {}
