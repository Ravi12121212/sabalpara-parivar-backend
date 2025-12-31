import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserProfile } from '../schemas/user-profile.schema';
import { FamilyMember } from '../schemas/family-member.schema';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(UserProfile.name) private profileModel: Model<UserProfile>,
    @InjectModel(FamilyMember.name) private familyModel: Model<FamilyMember>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async getProfile(userId: string) {
    return this.profileModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async getFull(userId: string) {
    const [profile, members] = await Promise.all([
      this.profileModel.findOne({ userId: new Types.ObjectId(userId) }),
      this.familyModel.find({ userId: new Types.ObjectId(userId) }),
    ]);
    // also include basic user record (email/phone) to allow frontend to show contact details
    const user = await this.userModel.findById(new Types.ObjectId(userId), { email: 1, phone: 1 });
    const userData = user ? { email: (user as any).email || null, phone: (user as any).phone || null } : { email: null, phone: null };
    return { profile, familyMembers: members, user: userData };
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

  // Return unique non-empty business names across profiles and family members
  async listBusinesses() {
    // From profiles.businessDetails (if used as business name)
    const profileRows = await this.profileModel.aggregate([
      { $match: { businessDetails: { $exists: true, $ne: null, $nin: ['', null] } } },
      { $group: { _id: { $toLower: '$businessDetails' }, name: { $first: '$businessDetails' } } },
      { $project: { _id: 0, name: '$name' } },
    ]);
    // From family members' businessName
    const familyRows = await this.familyModel.aggregate([
      { $match: { businessName: { $exists: true, $ne: null, $nin: ['', null] } } },
      { $group: { _id: { $toLower: '$businessName' }, name: { $first: '$businessName' } } },
      { $project: { _id: 0, name: '$name' } },
    ]);
    const map = new Map<string, string>();
    [...profileRows, ...familyRows].forEach((r: any) => {
      const key = String(r.name).trim().toLowerCase();
      if (!key) return;
      if (!map.has(key)) map.set(key, r.name);
    });
    const businesses = Array.from(map.values()).sort((a, b) => a.localeCompare(b));
    return { businesses };
  }

  // For a given business name, list users involved (profile or family member), without making them clickable
  async listUsersForBusiness(name: string) {
    if (!name) return { business: name, users: [] };
    const rx = new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    // Find matching profiles and families
    const [profiles, families] = await Promise.all([
      this.profileModel.find({ businessDetails: rx }),
      this.familyModel.find({ businessName: rx }),
    ]);
    // If no matches at all, return early
    const userIds = new Set<string>();
    profiles.forEach((p: any) => userIds.add((p as any).userId.toString()));
    families.forEach((f: any) => userIds.add((f as any).userId.toString()));
    if (userIds.size === 0) return { business: name, users: [] };

    const ids = Array.from(userIds);
    const idsObj = ids.map((s) => new Types.ObjectId(s));

    // Fetch users and profiles for the affected user ids
    const [users, profs] = await Promise.all([
      this.userModel.find({ _id: { $in: idsObj } }, { email: 1, phone: 1, createdAt: 1 }),
      this.profileModel.find({ userId: { $in: idsObj } }, { name: 1, village: 1, userId: 1 }),
    ]);
    const userMap = new Map(users.map((u: any) => [(u as any)._id.toString(), u] as const));
    const profMap = new Map(profs.map((p: any) => [p.userId.toString(), p] as const));

    // Build result list. For matching family members, return member-level entries.
    // Skip adding a user-level entry when that user has one or more matching family members.
    const memberEntries = families.map((fm: any) => {
      const userId = (fm.userId || fm.user)?.toString();
      const user = userMap.get(userId) as any;
      const profile = profMap.get(userId) as any;
      return {
        id: (fm as any)._id.toString(),
        userId,
        isMember: true,
        name: fm.memberName || null,
        village: profile?.village || null,
        email: user?.email || null,
        phone: user?.phone || null,
        relation: fm.relation || null,
        age: fm.age ?? null,
        businessName: fm.businessName || null,
        businessWorkType: fm.businessWorkType || null,
      };
    });

    // Determine which userIds already have member entries
    const usersWithMember = new Set(families.map((f: any) => (f.userId || f.user).toString()));

    // Add profile-based entries only for users without matching family members
    const profileEntries = profiles
      .filter((p: any) => !usersWithMember.has(p.userId.toString()))
      .map((p: any) => {
        const uid = p.userId.toString();
        const user = userMap.get(uid) as any;
        const derivedName = p?.name || (user?.email ? String(user.email).split('@')[0] : null) || (user?.phone || null);
        return {
          id: uid,
          userId: uid,
          isMember: false,
          name: derivedName || null,
          village: p?.village || null,
          email: user?.email || null,
          phone: user?.phone || null,
        };
      });

    const list = [...memberEntries, ...profileEntries];
    return { business: name, users: list };
  }
}
