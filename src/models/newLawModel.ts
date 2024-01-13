import { Document, model, Schema, mongoose } from "mongoose";

// Section Schema
interface Section {
    longTitle: string;
    Bare_Act: string[];
    Simplified_Act: string[];
    Explanation_using_Example: string[];
    shortTitle: string;
    law: mongoose.Types.ObjectId; // Reference to Law document
    chapter: mongoose.Types.ObjectId; // Reference to Chapter document
}

const sectionSchema = new Schema<Section>({
    longTitle: { type: String, required: true },
    Bare_Act: { type: [String], default: [] },
    Simplified_Act: { type: [String], default: [] },
    Explanation_using_Example: { type: [String], default: [] },
    shortTitle: { type: String, required: true },
    law: { type: Schema.Types.ObjectId, ref: 'Law' },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter' },
});

// Chapter Schema
interface Chapter {
    title: string[];
    sections: mongoose.Types.ObjectId[]; // Reference to Section documents
    law: mongoose.Types.ObjectId; // Reference to Law document
}

const chapterSchema = new Schema<Chapter>({
    title: { type: [String], default: [] },
    sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
    law: { type: Schema.Types.ObjectId, ref: 'Law' },
});

// Law Schema
export interface Law extends Document {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    summary: string;
    chapters: mongoose.Types.ObjectId[]; // Reference to Chapter documents
}

const lawSchema = new Schema<Law>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    summary: { type: String, required: true },
    chapters: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
});

// Models
export const SectionModel = model<Section>("Section", sectionSchema);
export const ChapterModel = model<Chapter>("Chapter", chapterSchema);
export const LawModel = model<Law>("Law", lawSchema);
