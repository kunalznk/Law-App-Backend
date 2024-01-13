// userModel.ts
import { Document, model, Schema } from "mongoose";

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model<User>('users', userSchema, 'users');

export const buildUser = (user: User): Document<User> => {
  return new UserModel(user);
};
