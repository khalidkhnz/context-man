import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { SkillType, ISkillVersion } from '../types/skill.types.js';

export interface ISkillModel extends Document {
  projectId: Types.ObjectId;
  name: string;
  type: SkillType;
  description: string;
  content: string;
  currentVersion: number;
  versions: ISkillVersion[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillVersionSchema = new Schema<ISkillVersion>(
  {
    version: { type: Number, required: true },
    content: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changeNote: { type: String },
  },
  { _id: false }
);

const SkillSchema = new Schema<ISkillModel>(
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
    type: {
      type: String,
      enum: Object.values(SkillType),
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    versions: {
      type: [SkillVersionSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'skills',
  }
);

// Unique skill name per project
SkillSchema.index({ projectId: 1, name: 1 }, { unique: true });

// Text index for search
SkillSchema.index(
  { name: 'text', description: 'text', content: 'text', tags: 'text' },
  { weights: { name: 10, description: 5, content: 3, tags: 2 } }
);

export const Skill: Model<ISkillModel> = mongoose.model<ISkillModel>('Skill', SkillSchema);

export default Skill;
