export { listProjectsTool, listProjects } from './list-projects.tool.js';
export { getProjectContextTool, getProjectContext } from './get-project-context.tool.js';
export { getDocumentTool, getDocument } from './get-document.tool.js';
export { getSkillsTool, getSkills } from './get-skills.tool.js';
export { getCodeSnippetsTool, getCodeSnippets } from './get-code-snippets.tool.js';
export { getPromptTemplateTool, getPromptTemplate } from './get-prompt-template.tool.js';
export { searchContentTool, searchContent } from './search-content.tool.js';

// Todo tools
export { listTodosTool } from './list-todos.tool.js';
export { getTodoTool } from './get-todo.tool.js';
export { createTodoTool } from './create-todo.tool.js';
export { updateTodoTool } from './update-todo.tool.js';
export { addTodoQATool } from './add-todo-qa.tool.js';
export { getTodoStatsTool } from './get-todo-stats.tool.js';

// Project initialization tools
export { browseTechstacksTool, browseTechstacks } from './browse-techstacks.tool.js';
export { initProjectFromTechstackTool, initProjectFromTechstack } from './init-project-from-techstack.tool.js';
export { initExistingProjectTool, initExistingProject } from './init-existing-project.tool.js';

// Catalog browsing tools
export { browseCatalogTool, browseCatalog } from './browse-catalog.tool.js';
export { browseAllSkillsTool, browseAllSkills } from './browse-all-skills.tool.js';
export { getSkillContentTool, getSkillContent } from './get-skill-content.tool.js';
export { getTechstackContentTool, getTechstackContent } from './get-techstack-content.tool.js';

export const allTools = [
  'list_projects',
  'get_project_context',
  'get_document',
  'get_skills',
  'get_code_snippets',
  'get_prompt_template',
  'search_content',
  'list_todos',
  'get_todo',
  'create_todo',
  'update_todo',
  'add_todo_qa',
  'get_todo_stats',
  'browse_techstacks',
  'init_project_from_techstack',
  'init_existing_project',
  'browse_catalog',
  'browse_all_skills',
  'get_skill_content',
  'get_techstack_content',
] as const;
