import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserProfile } from '../schemas/user-profile.schema';
import { FamilyMember } from '../schemas/family-member.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserProfile.name) private profileModel: Model<UserProfile>,
    @InjectModel(FamilyMember.name) private familyModel: Model<FamilyMember>,
  ) {}

  async findById(id: string) {
  const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByIdWithProfile(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
  const profile = await this.profileModel.findOne({ userId: user._id });
  const familyMembers = await this.familyModel.find({ userId: user._id });
    return {
      id: (user as any)._id.toString(),
      email: user.email,
      phone: user.phone,
      createdAt: (user as any).createdAt,
      profile: profile ? {
        village: profile.village,
        name: profile.name,
        totalFamilyMembers: profile.totalFamilyMembers,
        currentAddress: profile.currentAddress,
        businessDetails: profile.businessDetails,
      } : null,
      familyMembers: familyMembers.map(m => ({
        id: (m as any)._id.toString(),
        memberName: m.memberName,
        age: m.age,
        std: m.std,
        resultImage: m.resultImage,
        percentage: m.percentage,
        createdAt: (m as any).createdAt,
      })),
    };
  }

  async listUsersByVillage(village: string) {
    const trimmed = village.trim();
    if (!trimmed) return [];
  const profiles = await this.profileModel.find({ village: trimmed });
  const profileMap = new Map<string, UserProfile>();
  profiles.forEach(p => profileMap.set(p.userId.toString(), p));
  const userIds = profiles.map(p => p.userId);
    if (userIds.length === 0) return [];
    const [users, families] = await Promise.all([
      this.userModel.find({ _id: { $in: userIds } }, { email: 1, phone: 1, createdAt: 1 }),
      this.familyModel.find({ userId: { $in: userIds } }),
    ]);
    const familyMap = new Map<string, FamilyMember[]>();
    families.forEach(f => {
      const key = f.userId.toString();
      const arr = familyMap.get(key) || [];
      arr.push(f as any);
      familyMap.set(key, arr);
    });
    return users.map(u => {
      const id = (u as any)._id.toString();
      const profile = profileMap.get(id);
      return {
        id,
        email: u.email,
        phone: u.phone,
        createdAt: (u as any).createdAt,
        profile: profile ? {
          village: profile.village,
          name: profile.name,
          totalFamilyMembers: profile.totalFamilyMembers,
          currentAddress: profile.currentAddress,
          businessDetails: profile.businessDetails,
        } : null,
        familyMembers: (familyMap.get(id) || []).map(m => ({
          id: (m as any)._id.toString(),
          memberName: m.memberName,
          age: m.age,
          std: m.std,
          resultImage: m.resultImage,
          percentage: m.percentage,
          createdAt: (m as any).createdAt,
        })),
      };
    });
  }

  async promoteToAdmin(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    (user as any).role = 'admin';
    await user.save();
    return { id: (user as any)._id.toString(), role: (user as any).role };
  }

  async listAllForAdmin() {
    const users = await this.userModel.find({}, { email: 1, phone: 1, createdAt: 1, role: 1 });
    // Fetch profiles to get village and name (if stored there)
    const userIds = users.map(u => u._id);
    const profiles = await this.profileModel.find({ userId: { $in: userIds } }, { village: 1, name: 1, userId: 1 });
    const profileMap = new Map<string, any>();
    profiles.forEach(p => profileMap.set(p.userId.toString(), p));
    return users.map(u => {
      const id = (u as any)._id.toString();
      const profile = profileMap.get(id);
      return {
        id,
        name: profile?.name || null,
        email: u.email || null,
        phone: u.phone || null,
        village: profile?.village || null,
        isAdmin: (u as any).role === 'admin',
      };
    });
  }
}
