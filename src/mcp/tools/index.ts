export { listProjectsTool, listProjects } from './list-projects.tool.js';
export { getProjectContextTool, getProjectContext } from './get-project-context.tool.js';
export { getDocumentTool, getDocument } from './get-document.tool.js';
export { getSkillsTool, getSkills } from './get-skills.tool.js';
export { getCodeSnippetsTool, getCodeSnippets } from './get-code-snippets.tool.js';
export { getPromptTemplateTool, getPromptTemplate } from './get-prompt-template.tool.js';
export { searchContentTool, searchContent } from './search-content.tool.js';

export const allTools = [
  'list_projects',
  'get_project_context',
  'get_document',
  'get_skills',
  'get_code_snippets',
  'get_prompt_template',
  'search_content',
] as const;
