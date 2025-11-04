import { TaskPriority, TaskStatus } from "./task.type";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;     
  createdAt: Date;    
  updatedAt: Date;   
}

export type TaskPayload = Omit<Task, 'createdAt' | 'updatedAt'>;

export type TaskGroupedByStatus = {
  [K in TaskStatus]: Task[];
};

export interface TaskFilter {
  status: TaskStatus[];
  priority: TaskPriority[];
  dueDate: Date[] | null;
  text: string;
}

export interface TaskSort {
  field: string;
  dir: string;
}

export interface TaskQuery {
  filters: TaskFilter;
  sort: TaskSort;
}