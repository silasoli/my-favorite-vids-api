import mongoose from 'mongoose';

export interface Ipayload {
  _id?: mongoose.ObjectId | string;

  email: string;

  username: string;

  access_token: string;
}


export interface IloginPayload {
  id?: mongoose.ObjectId | string;

  email: string;

  username: string;

  access_token: string;
}
