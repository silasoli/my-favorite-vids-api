import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.entity';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  _id?: mongoose.ObjectId | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, default: true })
  privy: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: true })
  active?: boolean;
}


export const CategorySchema = SchemaFactory.createForClass(Category);
