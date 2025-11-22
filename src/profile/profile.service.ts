import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProfile } from '../schemas/user-profile.schema';
import { FamilyMember } from '../schemas/family-member.schema';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(UserProfile.name) private profileModel: Model<UserProfile>,
    @InjectModel(FamilyMember.name) private familyModel: Model<FamilyMember>,
  ) {}

  async getProfile(userId: string) {
    return this.profileModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async getFull(userId: string) {
    const [profile, members] = await Promise.all([
      this.profileModel.findOne({ userId: new Types.ObjectId(userId) }),
      this.familyModel.find({ userId: new Types.ObjectId(userId) }),
    ]);
    return { profile, familyMembers: members };
  }

  async upsert(userId: string, dto: UpsertProfileDto) {
    const userObjectId = new Types.ObjectId(userId);
    const update: any = {
      village: dto.village,
      name: dto.name,
  age: dto.age,
      cityName: dto.cityName,
      businessType: dto.businessType,
      currentAddress: dto.currentAddress,
      businessDetails: dto.businessDetails,
      phoneNumber: dto.phoneNumber,
      // Keep storing totalFamilyMembers for backward compatibility if provided
      totalFamilyMembers: dto.totalFamilyMembers ?? dto.familyMembers?.length,
    };
    const profile = await this.profileModel.findOneAndUpdate(
      { userId: userObjectId },
      { $set: update, $setOnInsert: { userId: userObjectId } },
      { new: true, upsert: true }
    );
    if (dto.familyMembers) {
      await this.familyModel.deleteMany({ userId: userObjectId });
      await this.familyModel.insertMany(
        dto.familyMembers.map((m) => ({
          userId: userObjectId,
          memberName: m.memberName,
          age: m.age,
          std: m.std,
          resultImage: m.resultImage,
          percentage: m.percentage,
          activityType: m.activityType,
          businessWorkType: m.businessWorkType,
          businessName: m.businessName,
          businessDescription: m.businessDescription,
          memberPhone: m.memberPhone,
          relation: m.relation,
          noneCategory: m.noneCategory,
        }))
      );
    }
    const familyMembers = await this.familyModel.find({ userId: userObjectId });
    return { profile, familyMembers };
  }

  // Return unique non-empty villages from all user profiles
  async listVillages() {
    const rows = await this.profileModel.aggregate([
      { $match: { village: { $exists: true, $ne: null, $nin: ['', null] } } },
      { $group: { _id: '$village' } },
      { $project: { village: '$_id', _id: 0 } },
      { $sort: { village: 1 } },
    ]);
    const villages = rows.map((r: any) => r.village);
    return { villages };
  }
}
