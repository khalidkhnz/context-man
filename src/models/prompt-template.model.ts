import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IPromptVariable, IPromptTemplateVersion } from '../types/prompt-template.types.js';

export interface IPromptTemplateModel extends Document {
  projectId: Types.ObjectId;
  name: string;
  description: string;
  content: string;
  variables: IPromptVariable[];
  currentVersion: number;
  versions: IPromptTemplateVersion[];
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromptVariableSchema = new Schema<IPromptVariable>(
  {
    name: { type: String, required: true },
    description: { type: String },
    required: { type: Boolean, default: false },
    defaultValue: { type: String },
  },
  { _id: false }
);

const PromptTemplateVersionSchema = new Schema<IPromptTemplateVersion>(
  {
    version: { type: Number, required: true },
    content: { type: String, required: true },
    variables: { type: [PromptVariableSchema], default: [] },
    changedAt: { type: Date, default: Date.now },
    changeNote: { type: String },
  },
  { _id: false }
);

const PromptTemplateSchema = new Schema<IPromptTemplateModel>(
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
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    variables: {
      type: [PromptVariableSchema],
      default: [],
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    versions: {
      type: [PromptTemplateVersionSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'prompt_templates',
  }
);

// Unique template name per project
PromptTemplateSchema.index({ projectId: 1, name: 1 }, { unique: true });

// Text index for search
PromptTemplateSchema.index(
  { name: 'text', description: 'text', content: 'text', tags: 'text' },
  { weights: { name: 10, description: 5, content: 3, tags: 2 } }
);

export const PromptTemplate: Model<IPromptTemplateModel> =
  mongoose.model<IPromptTemplateModel>('PromptTemplate', PromptTemplateSchema);

export default PromptTemplate;
