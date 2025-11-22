import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class PreviousYearResult extends Document {
  @Prop({ required: true })
  gamnuName!: string; // gamnu name

  @Prop({ required: true })
  currentResidenceCity!: string; // current residence city

  @Prop({ required: true })
  fatherFullName!: string; // father full name

  @Prop({ required: true })
  studentFullName!: string; // student full name

  @Prop({ required: true })
  mobileNumber!: string; // mobile number (string to keep formatting)

  @Prop({ required: true })
  currentStudyYear_25_26!: string; // current study year (25/26)

  @Prop({ required: true })
  currentStudyYear_24_25!: string; // previous study year (24/25)

  @Prop({ required: true })
  percentage!: number; // percentage

  @Prop()
  resultFileUrl?: string; // uploaded file (pdf/image)

  createdAt!: Date;
}

export const PreviousYearResultSchema = SchemaFactory.createForClass(PreviousYearResult);
