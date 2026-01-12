
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Menu, 
  Settings, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ChevronDown,
  Trophy,
  Activity,
  X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TaskItem from '../components/TaskItem';
import AddTaskInline from '../components/AddTaskInline';
import { INITIAL_TASKS, MOCK_PROJECTS, MOCK_USER } from '../constants.tsx';
import { Task, ViewType, Priority } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [showProductivity, setShowProductivity] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();
    }
  }, [isSearchActive]);

  const filteredTasks = useMemo(() => {
    // If search is active and there's a query, search globally
    if (isSearchActive && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return tasks.filter(t => 
        t.content.toLowerCase().includes(q) || 
        (t.description?.toLowerCase().includes(q)) ||
        t.labels.some(l => l.toLowerCase().includes(q))
      );
    }

    // Normal view filtering
    if (selectedProjectId) {
      return tasks.filter(t => t.projectId === selectedProjectId);
    }
    const today = new Date().toISOString().split('T')[0];
    switch (currentView) {
      case 'today':
        return tasks.filter(t => t.dueDate === today);
      case 'inbox':
        return tasks;
      case 'upcoming':
        return tasks.filter(t => t.dueDate > today);
      default:
        return tasks;
    }
  }, [tasks, currentView, selectedProjectId, isSearchActive, searchQuery]);

  const viewTitle = useMemo(() => {
    if (isSearchActive) return 'Search';
    if (selectedProjectId) {
      return MOCK_PROJECTS.find(p => p.id === selectedProjectId)?.name || 'Project';
    }
    return currentView.charAt(0).toUpperCase() + currentView.slice(1);
  }, [currentView, selectedProjectId, isSearchActive]);

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  const handleAddTask = (content: string, description: string, priority: Priority, date: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      description,
      priority,
      dueDate: date,
      isCompleted: false,
      projectId: selectedProjectId || 'p1',
      labels: [],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    setIsAddingTask(false);
  };

  const productivityData = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 6 },
    { day: 'Wed', completed: 8 },
    { day: 'Thu', completed: 3 },
    { day: 'Fri', completed: 5 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 4 },
  ];

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        currentView={isSearchActive ? 'filters' : currentView}
        selectedProjectId={selectedProjectId}
        onViewChange={(view, projectId) => {
          if (view === 'search' as any) {
            setIsSearchActive(true);
            setSelectedProjectId(undefined);
          } else {
            setIsSearchActive(false);
            setSearchQuery('');
            setCurrentView(view);
            setSelectedProjectId(projectId);
          }
        }}
        isMobileOpen={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-8 border-b border-gray-100 flex-shrink-0 transition-all">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
              onClick={() => setIsSidebarMobileOpen(true)}
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            {isSearchActive ? (
              <div className="flex-1 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg max-w-2xl border border-gray-200 focus-within:border-gray-400 focus-within:bg-white transition-all">
                <Search size={18} className="text-gray-400" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search tasks, tags, or projects..."
                  className="bg-transparent border-none outline-none w-full text-sm text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && handleCloseSearch()}
                />
                <button onClick={handleCloseSearch} className="p-1 hover:bg-gray-200 rounded-full">
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-gray-800">{viewTitle}</h1>
            )}
          </div>
          
          {!isSearchActive && (
            <div className="flex items-center gap-2 ml-4">
              <button 
                onClick={() => setShowProductivity(!showProductivity)}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                title="Productivity"
              >
                <Activity size={20} />
              </button>
              <button 
                onClick={() => setIsSearchActive(true)}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                title="Search"
              >
                <Search size={20} />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          )}
        </header>

        {/* Productivity Overlay */}
        {showProductivity && (
          <div className="absolute top-14 right-4 z-30 w-[320px] bg-white border border-gray-200 rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Trophy size={18} className="text-orange-500" />
                Your Productivity
              </h3>
              <span className="text-xs text-blue-600 font-semibold cursor-pointer">Edit Goals</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="text-2xl font-bold text-[#db4c3f]">{MOCK_USER.karma}</span>
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mt-1">Karma</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <span className="text-2xl font-bold text-green-600">69</span>
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mt-1">Week Streak</p>
              </div>
            </div>

            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData}>
                  <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                    {productivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completed >= 5 ? '#db4c3f' : '#cbd5e0'} />
                    ))}
                  </Bar>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Weekly Goal: 21/25 tasks</span>
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[84%]" />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {/* View Header Info */}
            {!isSearchActive && (
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <span className="text-sm font-bold text-gray-800">
                  {currentView === 'today' ? 'Today' : viewTitle}
                </span>
                {currentView === 'today' && (
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            )}

            {/* Task List */}
            <div className="space-y-1">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={handleToggleTask}
                  onSelect={(t) => console.log('Selected', t)}
                />
              ))}
            </div>

            {/* Search Specific Empty State */}
            {isSearchActive && filteredTasks.length === 0 && searchQuery.trim() !== '' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">No results found</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-1">
                  We couldn't find any tasks matching "{searchQuery}". Try a different keyword or filter.
                </p>
              </div>
            )}

            {/* General Empty State */}
            {filteredTasks.length === 0 && !isSearchActive && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <img 
                  src="https://picsum.photos/seed/empty/400/300" 
                  alt="No tasks" 
                  className="w-64 h-auto rounded-lg opacity-20 grayscale mb-6"
                />
                <h3 className="text-lg font-bold text-gray-700">All clear!</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-1">
                  Enjoy your free time or start planning your next move.
                </p>
                <button 
                  onClick={() => setIsAddingTask(true)}
                  className="mt-6 px-4 py-2 bg-[#db4c3f] text-white rounded font-bold text-sm hover:bg-[#c53727] transition-colors"
                >
                  Create a task
                </button>
              </div>
            )}

            {!isSearchActive && (
              <button 
                onClick={() => setIsAddingTask(true)}
                className="w-full flex items-center gap-2 mt-4 text-gray-400 hover:text-[#db4c3f] transition-colors group"
              >
                <Plus size={20} className="group-hover:bg-[#db4c3f] group-hover:text-white rounded-full p-0.5 transition-all" />
                <span className="text-sm">Add task</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Modal Add Task Sheet */}
        {isAddingTask && (
          <AddTaskInline 
            onAdd={handleAddTask} 
            onCancel={() => setIsAddingTask(false)} 
          />
        )}

        {!isSearchActive && (
          <button 
            onClick={() => setIsAddingTask(true)}
            className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-[#db4c3f] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
          >
            <Plus size={32} />
          </button>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
