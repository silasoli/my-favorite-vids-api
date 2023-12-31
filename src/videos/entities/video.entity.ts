import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.entity';
import VideoPlatform from '../enums/video-type.enum';

export type VideoDocument = Video & Document;
@Schema()
export class Video {
  _id?: mongoose.ObjectId | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @Prop({ required: true, lowercase: true })
  title: string;

  @Prop({ type: String, enum: VideoPlatform })
  platform: VideoPlatform;

  @Prop({ required: false, lowercase: true, default: null })
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: true })
  privy: boolean;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
