import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import {
  TodoStatus,
  TodoPriority,
  ITodoQA,
  ITodoVersion,
} from '../types/todo.types.js';

export interface ITodoModel extends Document {
  projectId: Types.ObjectId;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  tags: string[];
  dueDate?: Date;
  completedAt?: Date;
  parentId?: Types.ObjectId;
  questionsAnswers: ITodoQA[];
  currentVersion: number;
  versions: ITodoVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const TodoQASchema = new Schema<ITodoQA>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    askedAt: { type: Date, default: Date.now },
    context: { type: String },
  },
  { _id: false }
);

const TodoVersionSchema = new Schema<ITodoVersion>(
  {
    version: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changeNote: { type: String },
  },
  { _id: false }
);

const TodoSchema = new Schema<ITodoModel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
      index: true,
    },
    questionsAnswers: {
      type: [TodoQASchema],
      default: [],
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    versions: {
      type: [TodoVersionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'todos',
  }
);

// Text index for search
TodoSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, description: 5, tags: 3 }, language_override: 'textSearchLanguage' }
);

// Compound index for common queries
TodoSchema.index({ projectId: 1, status: 1, priority: -1 });

export const Todo: Model<ITodoModel> = mongoose.model<ITodoModel>('Todo', TodoSchema);

export default Todo;
