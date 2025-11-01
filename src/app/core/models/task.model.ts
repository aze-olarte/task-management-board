import { TaskPriority, TaskStatus } from "./task.type";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate: Date;     
  createdAt: Date;    
  updatedAt: Date;   
}