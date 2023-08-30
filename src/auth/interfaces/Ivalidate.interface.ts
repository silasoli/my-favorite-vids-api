import mongoose from 'mongoose';

export interface Ivalidate {
  sub: string;

  iat: number;

  exp: number;
}

export interface IvalidateReturn {
  _id: mongoose.ObjectId | string;
}
