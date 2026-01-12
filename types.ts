
export type Priority = 1 | 2 | 3 | 4;

export interface Task {
  id: string;
  content: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate: string;
  projectId: string;
  labels: string[];
  parentId?: string;
  subTasks?: Task[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  isFavorite: boolean;
  taskCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  karma: number;
  dailyGoal: number;
  weeklyGoal: number;
}

export type ViewType = 'inbox' | 'today' | 'upcoming' | 'filters' | 'project';
