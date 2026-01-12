
import React from 'react';
import { 
  Check, 
  Calendar, 
  Tag, 
  MoreHorizontal, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onSelect: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onSelect }) => {
  const priorityColors = {
    1: 'border-red-600',
    2: 'border-orange-500',
    3: 'border-blue-500',
    4: 'border-gray-400',
  };

  const priorityBg = {
    1: 'hover:bg-red-50',
    2: 'hover:bg-orange-50',
    3: 'hover:bg-blue-50',
    4: 'hover:bg-gray-50',
  };

  return (
    <div 
      className="group flex items-start gap-3 py-3 border-b border-gray-100 hover:bg-white cursor-pointer transition-all px-2 -mx-2 rounded-lg"
      onClick={() => onSelect(task)}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={`mt-0.5 min-w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
          task.isCompleted 
            ? 'bg-gray-400 border-gray-400' 
            : `${priorityColors[task.priority]} ${priorityBg[task.priority]}`
        }`}
      >
        {task.isCompleted && <Check size={12} className="text-white" />}
        {!task.isCompleted && (
          <Check size={12} className="text-transparent group-hover:text-gray-300 transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className={`text-sm leading-tight font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {task.content}
          </h4>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={18} className="text-gray-400 hover:text-gray-600" />
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-[11px] font-medium ${
              new Date(task.dueDate) < new Date() ? 'text-red-600' : 'text-purple-600'
            }`}>
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          )}

          {task.labels.map(label => (
            <div key={label} className="flex items-center gap-1 text-[11px] text-gray-500">
              <Tag size={12} />
              <span>{label}</span>
            </div>
          ))}

          {task.subTasks && task.subTasks.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <ChevronRight size={12} />
              <span>{task.subTasks.filter(st => st.isCompleted).length}/{task.subTasks.length} sub-tasks</span>
            </div>
          )}

          <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1 text-gray-400">
            <MessageSquare size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
