// factsModel.ts
import { Document, model, Schema } from "mongoose";

export interface Fact extends Document {
  _id: string;
  heading: string;
  fact: string;
}

const factsSchema = new Schema<Fact>({
  heading: { type: String, required: true },
  fact: { type: String, required: true },
});

export const FactsModel = model<Fact>('facts', factsSchema, 'facts');

export const buildFact = (fact: Fact): Document<Fact> => {
  return new FactsModel(fact);
};
