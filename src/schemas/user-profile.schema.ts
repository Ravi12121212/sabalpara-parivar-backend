import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Disable updatedAt timestamp
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class UserProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop()
  village?: string;

  @Prop()
  name?: string;

  @Prop({ type: Number })
  age?: number; // Main user age

  @Prop()
  totalFamilyMembers?: number;

  @Prop()
  currentAddress?: string;

  @Prop()
  businessDetails?: string;

  @Prop()
  phoneNumber?: string; // Profile contact phone (can duplicate user login phone)

  @Prop()
  cityName?: string; // City of residence

  @Prop({ enum: ['personal','job','none'], required: false })
  businessType?: string; // Main user business type

  createdAt!: Date;
  // updatedAt removed intentionally
}
export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
