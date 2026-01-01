import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Disable updatedAt timestamp
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class FamilyMember extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  memberName!: string;

  @Prop()
  age?: number;

  @Prop()
  std?: string;
  

  // 'અભ્યાસ' | 'વ્યવસાય' | 'none'
  @Prop({ enum: ['અભ્યાસ', 'વ્યવસાય', 'કોઈનહીં'], default: 'અભ્યાસ' })
  activityType?: string;

  // Only if activityType === 'વ્યવસાય' (or 'none' for house roles)
  @Prop({ enum: ['વ્યક્તિગત', 'નોકરી', 'કોઈનહીં'], required: false })
  businessWorkType?: string; // વ્યક્તિગત vs નોકરી vs કોઈનહીં

  @Prop()
  businessName?: string; // Name of વ્યવસાય or employer

  @Prop()
  businessDescription?: string; // What is the વ્યવસાય / role

  // Member phone (optional)
  @Prop()
  memberPhone?: string;

  // Relation to user (father, son, daughter, mother, wife, brother, other)
  @Prop({ enum: ['પિતા','માતા','પત્ની','પુત્ર','પુત્રી','ભાઈ','અન્ય'], required: false })
  relation?: string;

  // If businessWorkType === 'none' describe category: ગૃહિણી | નિવૃત્ત | બાળક
  @Prop({ enum: ['ગૃહિણી','નિવૃત્ત','બાળક'], required: false })
  noneCategory?: string;

  createdAt!: Date;
  // updatedAt removed intentionally
}
export const FamilyMemberSchema = SchemaFactory.createForClass(FamilyMember);
