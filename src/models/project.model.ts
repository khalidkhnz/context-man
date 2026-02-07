import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProjectDocument extends Document {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  metadata: Record<string, unknown>;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
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
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isTemplate: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

// Text index for search
ProjectSchema.index(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, description: 5, tags: 3 } }
);

export const Project: Model<IProjectDocument> = mongoose.model<IProjectDocument>(
  'Project',
  ProjectSchema
);

export default Project;
