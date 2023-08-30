import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, default: true })
  private: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: true })
  active?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
