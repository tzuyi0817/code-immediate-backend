import type { Types, Document } from 'mongoose';

export interface IUser {
  account: string;
  password: string;
}

export type User =  Document<unknown, any, IUser> & IUser & { _id: Types.ObjectId };
