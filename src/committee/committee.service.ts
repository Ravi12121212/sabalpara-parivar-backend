import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Committee } from "../schemas/committee.schema";

export interface CreateCommitteeDto {
  name: string;
}
export interface AddMemberDto {
  memberName: string;
  post: string;
  imageUrl?: string;
  contactNumber?: string;
}
export interface UpdateMemberDto {
  memberName: string;
  post: string;
  imageUrl?: string;
  contactNumber?: string;
}

@Injectable()
export class CommitteeService {
  constructor(
    @InjectModel(Committee.name) private committeeModel: Model<Committee>
  ) {}

  async list(): Promise<any[]> {
    return this.committeeModel.find().exec();
  }

  async create(dto: CreateCommitteeDto): Promise<any> {
    const existing = await this.committeeModel.findOne({ name: dto.name });
    if (existing) throw new ConflictException("Committee already exists");
    return this.committeeModel.create({ name: dto.name, members: [] });
  }

  async addMember(id: string, dto: AddMemberDto): Promise<any> {
    const committee = await this.committeeModel.findById(id);
    if (!committee) throw new NotFoundException("Committee not found");
    committee.members.push({
      memberName: dto.memberName,
      post: dto.post,
      imageUrl: dto.imageUrl,
      contactNumber: dto.contactNumber,
    } as any);
    await committee.save();
    return committee.toObject();
  }

  async updateMember(
    id: string,
    index: number,
    dto: UpdateMemberDto
  ): Promise<any> {
    const committee = await this.committeeModel.findById(id);
    if (!committee) throw new NotFoundException("Committee not found");
    if (index < 0 || index >= committee.members.length)
      throw new NotFoundException("Member not found");
    committee.members[index].memberName = dto.memberName;
    committee.members[index].post = dto.post;
    committee.members[index].imageUrl = dto.imageUrl;
    committee.members[index].contactNumber = dto.contactNumber;
    await committee.save();
    return committee.toObject();
  }

  async removeMember(id: string, index: number): Promise<any> {
    const committee = await this.committeeModel.findById(id);
    if (!committee) throw new NotFoundException("Committee not found");
    if (index < 0 || index >= committee.members.length)
      throw new NotFoundException("Member not found");
    committee.members.splice(index, 1);
    await committee.save();
    return committee.toObject();
  }
}
