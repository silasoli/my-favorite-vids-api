import mongoose from 'mongoose';

export interface Ilogin {
  _id?: mongoose.ObjectId | string;

  username: string;

  email: string;
}