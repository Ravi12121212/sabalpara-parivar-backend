import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class CommitteeMember {
  @Prop({ required: true })
  memberName!: string;
  @Prop({ required: true })
  post!: string; // position
  @Prop()
  imageUrl?: string;
  @Prop()
  contactNumber?: string;
  @Prop({ default: Date.now })
  addedAt!: Date;
}

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Committee extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: [CommitteeMember], default: [] })
  members!: CommitteeMember[];

  @Prop()
  createdAt!: Date;
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee);
export const CommitteeMemberSchema = SchemaFactory.createForClass(CommitteeMember);