
import React from 'react';
import { Task, Project, User } from './types';

export const COLORS = {
  primary: '#db4c3f',
  primaryHover: '#c53727',
  background: '#ffffff',
  sidebar: '#fafafa',
  border: '#f0f0f0',
};

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'MacStories', color: '#db4c3f', isFavorite: true, taskCount: 6 },
  { id: 'p2', name: 'Work', color: '#3182ce', isFavorite: true, taskCount: 2 },
  { id: 'p3', name: 'Personal', color: '#38a169', isFavorite: false, taskCount: 0 },
  { id: 'p4', name: 'Shopping', color: '#d69e2e', isFavorite: false, taskCount: 4 },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Panagiotis Tsamoudakis',
  email: 'panos@example.com',
  karma: 14904,
  dailyGoal: 5,
  weeklyGoal: 25,
  avatar: 'https://picsum.photos/seed/user/200',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    content: 'Todoist Foundations',
    description: 'Learn the basics of task management',
    isCompleted: false,
    priority: 1,
    dueDate: new Date().toISOString().split('T')[0],
    projectId: 'p1',
    labels: ['Writing'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    content: 'Favorite for MacStories Weekly',
    description: 'Draft the weekly picks section',
    isCompleted: false,
    priority: 2,
    dueDate: '2025-10-24',
    projectId: 'p1',
    labels: ['Writing'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    content: 'Monthly Log',
    isCompleted: false,
    priority: 3,
    dueDate: '2025-10-25',
    projectId: 'p1',
    labels: ['Planning'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    content: 'Newsletter Draft',
    isCompleted: false,
    priority: 1,
    dueDate: new Date().toISOString().split('T')[0],
    projectId: 'p2',
    labels: ['Work'],
    createdAt: new Date().toISOString(),
  }
];
