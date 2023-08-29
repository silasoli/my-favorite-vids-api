import mongoose from 'mongoose';

export interface Ipayload {
  _id?: mongoose.ObjectId | string;

  email: string;

  name: string;

  access_token: string;
}
