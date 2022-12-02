import { Schema, model } from "mongoose";
import type { IUser } from '../types/user';

const userSchema = new Schema<IUser>({
  account: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
});

const User = model<IUser>('User', userSchema);

export { User };