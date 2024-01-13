import { address, CreateUserSchema } from "./yup";
import { InferType } from "yup";
import { Document } from "mongoose";

export type User = InferType<typeof CreateUserSchema> & Document
export type UserAddress = InferType<typeof address>