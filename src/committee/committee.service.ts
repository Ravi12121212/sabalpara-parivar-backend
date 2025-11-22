import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Committee } from '../schemas/committee.schema';

interface MemberInput { memberName: string; post: string; }

@Injectable()
export class CommitteeService {
  constructor(@InjectModel(Committee.name) private committeeModel: Model<Committee>) {}

  async create(name: string, members: MemberInput[]) {
    const doc = await this.committeeModel.create({ name, members });
    return this.map(doc);
  }

  async list() {
    const docs = await this.committeeModel.find();
    return docs.map(d => this.map(d));
  }

  async addMember(id: string, member: MemberInput) {
    const doc = await this.committeeModel.findByIdAndUpdate(id, { $push: { members: member } }, { new: true });
    if (!doc) throw new NotFoundException('Committee not found');
    return this.map(doc);
  }

  async updateMember(id: string, memberIndex: number, member: MemberInput) {
    const doc = await this.committeeModel.findById(id);
    if (!doc) throw new NotFoundException('Committee not found');
    if (memberIndex < 0 || memberIndex >= doc.members.length) throw new NotFoundException('Member not found');
    (doc.members as any)[memberIndex].memberName = member.memberName;
    (doc.members as any)[memberIndex].post = member.post;
    await doc.save();
    return this.map(doc);
  }

  async removeMember(id: string, memberIndex: number) {
    const doc = await this.committeeModel.findById(id);
    if (!doc) throw new NotFoundException('Committee not found');
    if (memberIndex < 0 || memberIndex >= doc.members.length) throw new NotFoundException('Member not found');
    (doc.members as any).splice(memberIndex, 1);
    await doc.save();
    return this.map(doc);
  }

  async delete(id: string) {
    const res = await this.committeeModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Committee not found');
    return { success: true };
  }

  private map(doc: Committee) {
    return {
      id: (doc._id as Types.ObjectId).toString(),
      name: doc.name,
      createdAt: (doc as any).createdAt,
      members: (doc.members || []).map(m => ({ memberName: (m as any).memberName, post: (m as any).post, addedAt: (m as any).addedAt })),
    };
  }
}
