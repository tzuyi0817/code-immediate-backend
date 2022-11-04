import { Schema, model } from "mongoose";

interface IUser {
  account: string;
  password: string;
}

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