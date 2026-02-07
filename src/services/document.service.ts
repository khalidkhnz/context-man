import { Types } from 'mongoose';
import { ProjectDocument, IProjectDocumentModel } from '../models/document.model.js';
import { Project } from '../models/project.model.js';
import {
  DocumentType,
  CreateDocumentInput,
  UpdateDocumentInput,
  IDocumentVersion,
} from '../types/document.types.js';

export class DocumentService {
  async create(
    projectSlug: string,
    input: CreateDocumentInput
  ): Promise<IProjectDocumentModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const doc = new ProjectDocument({
      projectId: project._id,
      type: input.type,
      title: input.title,
      content: input.content,
      tags: input.tags || [],
      currentVersion: 1,
      versions: [
        {
          version: 1,
          content: input.content,
          changedAt: new Date(),
          changeNote: input.changeNote || 'Initial version',
          author: input.username,
        },
      ],
      authors: input.username ? [input.username] : [],
      lastAuthor: input.username || '',
    });

    const saved = await doc.save();

    // Track author at project level
    if (input.username) {
      await Project.findOneAndUpdate(
        { slug: projectSlug.toLowerCase() },
        { $addToSet: { authors: input.username }, $set: { lastAuthor: input.username } }
      );
    }

    return saved;
  }

  async findByProjectAndType(
    projectSlug: string,
    type: DocumentType
  ): Promise<IProjectDocumentModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    return ProjectDocument.findOne({ projectId: project._id, type });
  }

  async findAllByProject(projectSlug: string): Promise<IProjectDocumentModel[]> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return [];

    return ProjectDocument.find({ projectId: project._id }).sort({ type: 1 });
  }

  async findByProjectId(projectId: string | Types.ObjectId): Promise<IProjectDocumentModel[]> {
    return ProjectDocument.find({ projectId }).sort({ type: 1 });
  }

  async update(
    projectSlug: string,
    type: DocumentType,
    input: UpdateDocumentInput
  ): Promise<IProjectDocumentModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const doc = await ProjectDocument.findOne({ projectId: project._id, type });
    if (!doc) return null;

    // Save current version to history if content is changing
    if (input.content && input.content !== doc.content) {
      doc.versions.push({
        version: doc.currentVersion,
        content: doc.content,
        changedAt: new Date(),
        changeNote: input.changeNote,
        author: input.username,
      });
      doc.currentVersion += 1;
      doc.content = input.content;
    }

    if (input.title !== undefined) doc.title = input.title;
    if (input.tags !== undefined) doc.tags = input.tags;

    // Track author on document
    if (input.username) {
      if (!doc.authors.includes(input.username)) {
        doc.authors.push(input.username);
      }
      doc.lastAuthor = input.username;
    }

    const saved = await doc.save();

    // Track author at project level
    if (input.username) {
      await Project.findOneAndUpdate(
        { slug: projectSlug.toLowerCase() },
        { $addToSet: { authors: input.username }, $set: { lastAuthor: input.username } }
      );
    }

    return saved;
  }

  async delete(projectSlug: string, type: DocumentType): Promise<boolean> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return false;

    const result = await ProjectDocument.deleteOne({ projectId: project._id, type });
    return result.deletedCount > 0;
  }

  async getVersion(
    projectSlug: string,
    type: DocumentType,
    version: number
  ): Promise<IDocumentVersion | null> {
    const doc = await this.findByProjectAndType(projectSlug, type);
    if (!doc) return null;

    // If requesting current version, return current content
    if (version === doc.currentVersion) {
      return {
        version: doc.currentVersion,
        content: doc.content,
        changedAt: doc.updatedAt,
      };
    }

    // Otherwise, find in version history
    return doc.versions.find((v) => v.version === version) || null;
  }

  async getVersionHistory(
    projectSlug: string,
    type: DocumentType
  ): Promise<Array<{ version: number; changedAt: Date; changeNote?: string }>> {
    const doc = await this.findByProjectAndType(projectSlug, type);
    if (!doc) return [];

    const history = doc.versions.map((v) => ({
      version: v.version,
      changedAt: v.changedAt,
      changeNote: v.changeNote,
    }));

    // Add current version
    history.push({
      version: doc.currentVersion,
      changedAt: doc.updatedAt,
      changeNote: 'Current version',
    });

    return history.sort((a, b) => b.version - a.version);
  }
}

export const documentService = new DocumentService();
export default documentService;
