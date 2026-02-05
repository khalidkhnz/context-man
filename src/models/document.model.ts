import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { DocumentType, IDocumentVersion } from '../types/document.types.js';

export interface IProjectDocumentModel extends Document {
  projectId: Types.ObjectId;
  type: DocumentType;
  title: string;
  content: string;
  currentVersion: number;
  versions: IDocumentVersion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentVersionSchema = new Schema<IDocumentVersion>(
  {
    version: { type: Number, required: true },
    content: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changeNote: { type: String },
  },
  { _id: false }
);

const ProjectDocumentSchema = new Schema<IProjectDocumentModel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(DocumentType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
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
      type: [DocumentVersionSchema],
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
    collection: 'documents',
  }
);

// Compound index for unique document type per project
ProjectDocumentSchema.index({ projectId: 1, type: 1 }, { unique: true });

// Text index for full-text search
ProjectDocumentSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, content: 5, tags: 3 } }
);

export const ProjectDocument: Model<IProjectDocumentModel> =
  mongoose.model<IProjectDocumentModel>('ProjectDocument', ProjectDocumentSchema);

export default ProjectDocument;
