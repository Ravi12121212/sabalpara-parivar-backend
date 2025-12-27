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
  

  // 'study' | 'business' | 'none'
  @Prop({ enum: ['study', 'business', 'none'], default: 'study' })
  activityType?: string;

  // Only if activityType === 'business' (or 'none' for house roles)
  @Prop({ enum: ['personal', 'job', 'none'], required: false })
  businessWorkType?: string; // personal vs job vs none

  @Prop()
  businessName?: string; // Name of business or employer

  @Prop()
  businessDescription?: string; // What is the business / role

  // Member phone (optional)
  @Prop()
  memberPhone?: string;

  // Relation to user (father, son, daughter, mother, wife, brother, other)
  @Prop({ enum: ['father','son','daughter','mother','wife','brother','other'], required: false })
  relation?: string;

  // If businessWorkType === 'none' describe category: house_wife | retired | child
  @Prop({ enum: ['house_wife','retired','child'], required: false })
  noneCategory?: string;

  createdAt!: Date;
  // updatedAt removed intentionally
}
export const FamilyMemberSchema = SchemaFactory.createForClass(FamilyMember);
