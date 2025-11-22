import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  phone!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role!: 'admin' | 'user';

  @Prop()
  createdAt!: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
