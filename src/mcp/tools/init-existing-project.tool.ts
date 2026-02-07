import { z } from 'zod';
import { projectService, documentService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export const initExistingProjectSchema = z.object({
  username: z.string().optional().describe('Username of the person initializing this project'),
  projectSlug: z.string().describe('Slug for the project in context-man'),
  projectName: z.string().describe('Display name for the project'),
  projectDescription: z.string().optional().describe('Description of the project'),
  projectPath: z.string().describe('Path to the existing project directory'),
  tags: z.array(z.string()).optional().describe('Tags for the project'),
  scanForDocs: z.boolean().optional().default(true).describe('Scan for common documentation files'),
  customDocs: z
    .array(
      z.object({
        type: z.enum(['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'CODING_GUIDELINES', 'UI_UX_STANDARDS']),
        filePath: z.string().describe('Relative path to the file'),
      })
    )
    .optional()
    .describe('Custom mapping of files to document types'),
});

export type InitExistingProjectInput = z.infer<typeof initExistingProjectSchema>;

// Common file names to scan for
const DOC_FILE_MAPPING: Record<string, string[]> = {
  PLAN: ['PLAN.md', 'plan.md', 'ROADMAP.md', 'roadmap.md'],
  TODO: ['TODO.md', 'todo.md', 'TASKS.md', 'tasks.md'],
  SCOPE: ['SCOPE.md', 'scope.md', 'REQUIREMENTS.md', 'requirements.md', 'PRD.md'],
  TECHSTACK: ['TECHSTACK.md', 'techstack.md', 'TECH.md', 'STACK.md', 'ARCHITECTURE.md'],
  CODING_GUIDELINES: [
    'CODING_GUIDELINES.md',
    'CONTRIBUTING.md',
    'CODE_STYLE.md',
    'STYLE_GUIDE.md',
    '.github/CONTRIBUTING.md',
  ],
  UI_UX_STANDARDS: ['UI_UX_STANDARDS.md', 'DESIGN.md', 'STYLE.md', 'UI.md'],
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFileContent(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export async function initExistingProject(input: InitExistingProjectInput) {
  // Check if project already exists
  const existingProject = await projectService.findBySlug(input.projectSlug);
  if (existingProject) {
    return { error: `Project "${input.projectSlug}" already exists in context-man` };
  }

  // Check if project path exists
  const projectPathExists = await fileExists(input.projectPath);
  if (!projectPathExists) {
    return { error: `Project path "${input.projectPath}" does not exist` };
  }

  // Create the project (user project, not a template)
  const project = await projectService.create({
    slug: input.projectSlug,
    name: input.projectName,
    description: input.projectDescription,
    tags: input.tags || [],
    isTemplate: false,
    username: input.username,
  });

  if (!project) {
    return { error: 'Failed to create project' };
  }

  const importedDocs: { type: string; file: string }[] = [];
  const notFoundDocs: { type: string; searchedFiles: string[] }[] = [];

  // Process custom docs first
  if (input.customDocs) {
    for (const customDoc of input.customDocs) {
      const fullPath = path.join(input.projectPath, customDoc.filePath);
      const content = await readFileContent(fullPath);

      if (content) {
        const docType = DocumentType[customDoc.type as keyof typeof DocumentType];
        await documentService.create(input.projectSlug, {
          type: docType,
          title: customDoc.type,
          content,
          tags: [],
          changeNote: `Imported from ${customDoc.filePath}`,
          username: input.username,
        });
        importedDocs.push({ type: customDoc.type, file: customDoc.filePath });
      }
    }
  }

  // Scan for docs if enabled
  if (input.scanForDocs) {
    for (const [docTypeStr, fileNames] of Object.entries(DOC_FILE_MAPPING)) {
      // Skip if already imported via custom docs
      if (importedDocs.some((d) => d.type === docTypeStr)) {
        continue;
      }

      let found = false;
      for (const fileName of fileNames) {
        const fullPath = path.join(input.projectPath, fileName);
        const content = await readFileContent(fullPath);

        if (content) {
          const docType = DocumentType[docTypeStr as keyof typeof DocumentType];
          await documentService.create(input.projectSlug, {
            type: docType,
            title: docTypeStr,
            content,
            tags: [],
            changeNote: `Imported from ${fileName}`,
            username: input.username,
          });
          importedDocs.push({ type: docTypeStr, file: fileName });
          found = true;
          break;
        }
      }

      if (!found) {
        notFoundDocs.push({ type: docTypeStr, searchedFiles: fileNames });
      }
    }
  }

  // Try to detect techstack from package.json if not found
  if (!importedDocs.some((d) => d.type === 'TECHSTACK')) {
    const packageJsonPath = path.join(input.projectPath, 'package.json');
    const packageJson = await readFileContent(packageJsonPath);

    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson);
        const techstackContent = generateTechstackFromPackageJson(pkg);
        await documentService.create(input.projectSlug, {
          type: DocumentType.TECHSTACK,
          title: 'TECHSTACK',
          content: techstackContent,
          tags: [],
          changeNote: 'Auto-generated from package.json',
          username: input.username,
        });
        importedDocs.push({ type: 'TECHSTACK', file: 'package.json (auto-generated)' });
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  return {
    message: 'Project initialized successfully',
    project: {
      slug: project.slug,
      name: project.name,
      description: project.description,
      tags: project.tags,
    },
    imported: {
      documents: importedDocs,
      count: importedDocs.length,
    },
    notFound: {
      documents: notFoundDocs,
      count: notFoundDocs.length,
    },
    tips: notFoundDocs.length > 0
      ? `Consider creating these documents: ${notFoundDocs.map((d) => d.type).join(', ')}`
      : 'All standard documents were found and imported',
  };
}

function generateTechstackFromPackageJson(pkg: Record<string, unknown>): string {
  const deps = (pkg.dependencies || {}) as Record<string, string>;
  const devDeps = (pkg.devDependencies || {}) as Record<string, string>;

  let content = `# Tech Stack\n\n`;
  content += `Auto-generated from package.json\n\n`;

  if (pkg.name) {
    content += `## Project: ${pkg.name}\n\n`;
  }

  if (pkg.description) {
    content += `${pkg.description}\n\n`;
  }

  content += `## Dependencies\n\n`;
  for (const [name, version] of Object.entries(deps)) {
    content += `- ${name}: ${version}\n`;
  }

  if (Object.keys(devDeps).length > 0) {
    content += `\n## Dev Dependencies\n\n`;
    for (const [name, version] of Object.entries(devDeps)) {
      content += `- ${name}: ${version}\n`;
    }
  }

  return content;
}

export const initExistingProjectTool = {
  name: 'init_existing_project',
  description: 'Initialize an existing project into context-man by scanning for documentation files',
  inputSchema: initExistingProjectSchema,
  handler: initExistingProject,
};

export default initExistingProjectTool;
