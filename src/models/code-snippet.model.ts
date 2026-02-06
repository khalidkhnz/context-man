import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { ICodeSnippetVersion } from '../types/code-snippet.types.js';

export interface ICodeSnippetModel extends Document {
  projectId: Types.ObjectId;
  name: string;
  language: string;
  code: string;
  description: string;
  currentVersion: number;
  versions: ICodeSnippetVersion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CodeSnippetVersionSchema = new Schema<ICodeSnippetVersion>(
  {
    version: { type: Number, required: true },
    code: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changeNote: { type: String },
  },
  { _id: false }
);

const CodeSnippetSchema = new Schema<ICodeSnippetModel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    versions: {
      type: [CodeSnippetVersionSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'code_snippets',
  }
);

// Unique snippet name per project
CodeSnippetSchema.index({ projectId: 1, name: 1 }, { unique: true });

// Text index for search
// Use language_override to avoid conflict with our 'language' field (programming language)
CodeSnippetSchema.index(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, description: 5, tags: 3 }, language_override: 'textSearchLanguage' }
);

export const CodeSnippet: Model<ICodeSnippetModel> = mongoose.model<ICodeSnippetModel>(
  'CodeSnippet',
  CodeSnippetSchema
);

export default CodeSnippet;
