// userModel.ts
import { Document, model, Schema } from "mongoose";

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  imgUrl: string,
  mobile:string,
  otp:string,
  expiresAt: string,
  isVerified: boolean
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imgUrl: { type: String },
  mobile: { type: String },
  otp: { type: String },
  expiresAt: { type: String },
  isVerified: { type: Boolean, default: false}
});

export const UserModel = model<User>('users', userSchema, 'users');

export const buildUser = (user: User): Document<User> => {
  return new UserModel(user);
};
