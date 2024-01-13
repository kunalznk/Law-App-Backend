import { Document, model, Schema } from "mongoose";

export interface Law extends Document {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    summary: string;
    chapters: {
        title: string[];
        sections: {
            longTitle: string;
            Bare_Act: string[];
            Simplified_Act: string[];
            Explanation_using_Example: string[];
            shortTitle: string;
        }[];
    }[];
}

const lawSchema = new Schema<Law>({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    summary: { type: String, required: true },
    chapters: [{
        title: { type: [String], default: [] },
        sections: [{
            longTitle: { type: String, required: true },
            Bare_Act: { type: [String], default: [] },
            Simplified_Act: { type: [String], default: [] },
            Explanation_using_Example: { type: [String], default: [] },
            shortTitle: { type: String, required: true },
        }],
    }],
});

export const LawModel = model<Law>('laws', lawSchema, 'laws');

export const buildLaw = (law: Law): Document<Law> => {
    return new LawModel(law);
}
