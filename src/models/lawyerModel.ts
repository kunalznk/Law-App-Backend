// lawyerModel.ts
import { Document, model, Schema } from "mongoose";

// Interface for the sub-document Case
interface Case {
  title: string;
  description: string;
  when: Date;
}

// Interface for the main Lawyer document
export interface Lawyer extends Document {
  _id: string;
  name: string;
  lawFirm: string;
  description: string;
  numberOfCases: number;
  age: number;
  typeOfLawyer: string;
  rating: number;
  cases: Case[];
}

// Schema for the sub-document Case
const caseSchema = new Schema<Case>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  when: { type: Date, required: true },
});

// Schema for the main Lawyer document
const lawyerSchema = new Schema<Lawyer>({
  name: { type: String, required: true },
  lawFirm: { type: String },
  description: { type: String },
  numberOfCases: { type: Number },
  age: { type: Number },
  typeOfLawyer: { type: String },
  rating: { type: Number },
  cases: [caseSchema],
});

// Model for the Lawyer document
export const LawyerModel = model<Lawyer>('lawyers', lawyerSchema, 'lawyers');

// Function to build a new Lawyer document
export const buildLawyer = (lawyer: Lawyer): Document<Lawyer> => {
  return new LawyerModel(lawyer);
};
