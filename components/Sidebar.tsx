
import React from 'react';
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
  Users
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_USER } from '../constants.tsx';
import { Project, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  selectedProjectId?: string;
  onViewChange: (view: ViewType, projectId?: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  selectedProjectId, 
  onViewChange,
  isMobileOpen,
  onCloseMobile
}) => {
  const [projectsOpen, setProjectsOpen] = React.useState(true);
  const [favoritesOpen, setFavoritesOpen] = React.useState(true);

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

  // Use React.FC to handle intrinsic props like 'key' and solve the TS error
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
                {MOCK_PROJECTS.filter(p => p.isFavorite).map(p => (
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
              <Plus size={16} className="text-gray-500 opacity-0 group-hover:opacity-100 hover:text-gray-800" />
            </div>
            {projectsOpen && (
              <div className="mt-1 space-y-1">
                {MOCK_PROJECTS.map(p => (
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
