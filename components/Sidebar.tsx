
import React, { useState, useRef, useEffect } from 'react';
import { 
  Inbox, 
  Calendar, 
  Search, 
  Hash, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Settings,
  Bell,
  Star,
  Users,
  Check,
  X
} from 'lucide-react';
import { MOCK_USER } from '../constants.tsx';
import { Project, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  selectedProjectId?: string;
  projects: Project[];
  onViewChange: (view: ViewType, projectId?: string) => void;
  onAddProject: (name: string, color: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const PROJECT_COLORS = [
  { name: 'Berry Red', hex: '#b8256f' },
  { name: 'Red', hex: '#db4035' },
  { name: 'Orange', hex: '#ff9933' },
  { name: 'Yellow', hex: '#fad000' },
  { name: 'Olive Green', hex: '#afb83b' },
  { name: 'Lime Green', hex: '#7ecc49' },
  { name: 'Green', hex: '#299438' },
  { name: 'Mint', hex: '#6accbc' },
  { name: 'Teal', hex: '#158fad' },
  { name: 'Sky Blue', hex: '#14aaf5' },
  { name: 'Light Blue', hex: '#96c3eb' },
  { name: 'Blue', hex: '#4073ff' },
  { name: 'Grape', hex: '#884dff' },
  { name: 'Violet', hex: '#af38eb' },
  { name: 'Lavender', hex: '#eb96eb' },
  { name: 'Magenta', hex: '#e05194' },
  { name: 'Salmon', hex: '#ff8d85' },
  { name: 'Charcoal', hex: '#808080' },
  { name: 'Grey', hex: '#b8b8b8' },
  { name: 'Taupe', hex: '#ccac93' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  selectedProjectId, 
  projects,
  onViewChange,
  onAddProject,
  isMobileOpen,
  onCloseMobile
}) => {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(PROJECT_COLORS[1].hex);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAddingProject) {
      const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)].hex;
      setNewProjectColor(randomColor);
      setNewProjectName('');
      setTimeout(() => projectInputRef.current?.focus(), 50);
    }
  }, [isAddingProject]);

  // Handle click outside for color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  const handleSaveProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim(), newProjectColor);
      setIsAddingProject(false);
    }
  };

  const NavItem = ({ icon: Icon, label, id, count, color }: any) => (
    <button
      onClick={() => {
        onViewChange(id);
        onCloseMobile();
      }}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
        currentView === id && !selectedProjectId 
          ? 'bg-[#eeeeee] font-semibold' 
          : 'hover:bg-[#eeeeee]'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={color ? `text-[${color}]` : 'text-gray-600'} style={{ color }} />
        <span className="text-gray-700">{label}</span>
      </div>
      {count !== undefined && <span className="text-xs text-gray-400">{count}</span>}
    </button>
  );

  const ProjectItem: React.FC<{ project: Project }> = ({ project }) => (
    <button
      onClick={() => {
        onViewChange('project', project.id);
        onCloseMobile();
      }}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
        selectedProjectId === project.id 
          ? 'bg-[#eeeeee] font-semibold' 
          : 'hover:bg-[#eeeeee]'
      }`}
    >
      <div className="flex items-center gap-3 pl-4">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color }}></span>
        <span className="text-gray-700 truncate">{project.name}</span>
      </div>
      <span className="text-xs text-gray-400">{project.taskCount}</span>
    </button>
  );

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-[280px] bg-[#fafafa] border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={onCloseMobile}
        />
      )}

      {/* Add Project Modal */}
      {isAddingProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingProject(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Add Project</h3>
              <button onClick={() => setIsAddingProject(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 p-1.5 border border-gray-200 rounded-lg focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
              <div className="relative" ref={pickerRef}>
                <button 
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:scale-110 transition-transform active:scale-95"
                  style={{ backgroundColor: newProjectColor }}
                  title="Choose color"
                >
                  <div className="w-2 h-2 bg-white rounded-full opacity-40" />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-3 p-3 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-[240px] animate-in fade-in slide-in-from-top-2">
                    <div className="mb-2 px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Color</div>
                    <div className="grid grid-cols-5 gap-2">
                      {PROJECT_COLORS.map(color => (
                        <button 
                          key={color.hex}
                          onClick={() => {
                            setNewProjectColor(color.hex);
                            setShowColorPicker(false);
                          }}
                          className={`group relative w-8 h-8 rounded-full border border-black/5 transition-all hover:scale-125 flex items-center justify-center`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {newProjectColor === color.hex && (
                            <Check size={14} className="text-white drop-shadow-md" strokeWidth={3} />
                          )}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-100">
                            {color.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <input 
                ref={projectInputRef}
                type="text" 
                placeholder="Enter Project Name"
                className="flex-1 bg-transparent outline-none text-base font-medium text-gray-800 px-2"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveProject();
                  if (e.key === 'Escape') setIsAddingProject(false);
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-10">
              <button 
                onClick={() => setIsAddingProject(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProject}
                disabled={!newProjectName.trim()}
                className={`px-8 py-2 rounded-lg font-bold text-sm text-white shadow-lg transition-all ${newProjectName.trim() ? 'bg-[#db4c3f] hover:bg-[#c53727] active:scale-95' : 'bg-red-200 cursor-not-allowed'}`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full overflow-y-auto pt-4 pb-8 px-3">
          {/* User Profile / Header */}
          <div className="flex items-center justify-between px-2 mb-6">
            <div className="flex items-center gap-2">
              <img src={MOCK_USER.avatar} className="w-6 h-6 rounded-full" alt="avatar" />
              <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">{MOCK_USER.name}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Bell size={18} className="hover:text-gray-800 cursor-pointer" />
              <Settings size={18} className="hover:text-gray-800 cursor-pointer" />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">
            <NavItem icon={Plus} label="Add task" id="add" color="#db4c3f" />
            <NavItem icon={Search} label="Search" id="search" />
            <NavItem icon={Inbox} label="Inbox" id="inbox" count={4} />
            <NavItem icon={Calendar} label="Today" id="today" count={2} />
            <NavItem icon={Calendar} label="Upcoming" id="upcoming" />
            <NavItem icon={Hash} label="Filters & Labels" id="filters" />
          </nav>

          {/* Favorites */}
          <div className="mt-8">
            <div 
              className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => setFavoritesOpen(!favoritesOpen)}
            >
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                <ChevronRight size={14} className={`transition-transform ${favoritesOpen ? 'rotate-90' : ''}`} />
                <span>Favorites</span>
              </div>
            </div>
            {favoritesOpen && (
              <div className="mt-1 space-y-1">
                {projects.filter(p => p.isFavorite).map(p => (
                  <ProjectItem key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="mt-6">
            <div 
              className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-gray-100 rounded-md group"
            >
              <div 
                className="flex items-center gap-2 text-gray-900 font-semibold text-sm flex-1"
                onClick={() => setProjectsOpen(!projectsOpen)}
              >
                <ChevronRight size={14} className={`transition-transform ${projectsOpen ? 'rotate-90' : ''}`} />
                <span>My Projects</span>
          </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingProject(true);
                }}
                className="p-1 rounded hover:bg-gray-200 text-gray-500 opacity-0 group-hover:opacity-100 transition-all hover:text-gray-800"
              >
                <Plus size={16} />
              </button>
            </div>
            {projectsOpen && (
              <div className="mt-1 space-y-1">
                {projects.map(p => (
                  <ProjectItem key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>

          {/* Team (Optional) */}
          <div className="mt-auto pt-8">
            <NavItem icon={Users} label="Team Inbox" id="team" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
