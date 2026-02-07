export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TodoPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ITodoQA {
  question: string;
  answer: string;
  askedAt: Date;
  context?: string; // Optional context about when/why this was asked
}

export interface ITodoVersion {
  version: number;
  title: string;
  description: string;
  status: TodoStatus;
  changedAt: Date;
  changeNote?: string;
  author?: string;
}

export type CreateTodoInput = {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  dueDate?: Date;
  parentId?: string; // For subtasks
  questionsAnswers?: ITodoQA[];
  changeNote?: string;
  username?: string;
};

export type UpdateTodoInput = {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  dueDate?: Date;
  changeNote?: string;
  username?: string;
};

export type AddTodoQAInput = {
  question: string;
  answer: string;
  context?: string;
  username?: string;
};

export type TodoFilterOptions = {
  status?: TodoStatus | TodoStatus[];
  priority?: TodoPriority | TodoPriority[];
  tags?: string[];
  includeCompleted?: boolean;
  parentId?: string | null; // null for root todos only
};
