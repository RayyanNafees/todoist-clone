
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar, Tag, Flag, X, ChevronRight, Clock } from 'lucide-react';
import { Priority } from '../types';

interface AddTaskInlineProps {
  onAdd: (content: string, description: string, priority: Priority, date: string) => void;
  onCancel: () => void;
}

const PRIORITIES: { val: Priority; label: string; color: string; code: string }[] = [
  { val: 1, label: 'P0', color: '#ef4444', code: '!!0' },
  { val: 2, label: 'P1', color: '#f97316', code: '!!1' },
  { val: 3, label: 'P2', color: '#eab308', code: '!!2' },
  { val: 4, label: 'P3', color: '#22c55e', code: '!!3' },
  { val: 4, label: 'P4', color: '#3b82f6', code: '!!4' }, // P4 is lowest, using Blue as requested
];

const EXISTING_TAGS = ['Writing', 'Work', 'Personal', 'Planning', 'Grocery', 'Urgent'];

const AddTaskInline: React.FC<AddTaskInlineProps> = ({ onAdd, onCancel }) => {
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'date' | 'priority' | 'tags'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    inputRef.current?.focus();
    return () => clearTimeout(timer);
  }, []);

  // Parsing Logic
  const parsedData = useMemo(() => {
    const priorityMatch = content.match(/!!([0-4])/);
    const dateMatch = content.match(/(@today|@tomorrow|@\d{4}-\d{2}-\d{2})/);
    const tagMatches = content.match(/#(\w+)/g) || [];
    const uniqueTags = Array.from(new Set(tagMatches));

    let priority: Priority = 4;
    if (priorityMatch) {
      const pNum = parseInt(priorityMatch[1]);
      priority = (pNum === 0 ? 1 : pNum === 1 ? 2 : pNum === 2 ? 3 : 4) as Priority;
    }

    let dateText = 'Today';
    let dateVal = new Date().toISOString().split('T')[0];
    if (dateMatch) {
      const match = dateMatch[0];
      if (match === '@today') {
        dateText = 'Today';
        dateVal = new Date().toISOString().split('T')[0];
      } else if (match === '@tomorrow') {
        dateText = 'Tomorrow';
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateVal = tomorrow.toISOString().split('T')[0];
      } else {
        dateText = match.replace('@', '');
        dateVal = dateText;
      }
    }

    return { priority, dateText, dateVal, tagCount: uniqueTags.length };
  }, [content]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300);
  };

  const updateContentPart = (regex: RegExp, replacement: string) => {
    if (regex.test(content)) {
      setContent(content.replace(regex, replacement));
    } else {
      setContent(prev => (prev.trim() + ' ' + replacement).trim());
    }
    setActiveDropdown('none');
  };

  const addTag = (tag: string) => {
    const tagStr = `#${tag}`;
    if (!content.includes(tagStr)) {
      setContent(prev => (prev.trim() + ' ' + tagStr).trim());
    }
    setActiveDropdown('none');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content, description, parsedData.priority, parsedData.dateVal);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      <div 
        className={`relative w-full max-w-2xl bg-white rounded-t-xl shadow-2xl transition-transform duration-300 ease-out transform overflow-hidden ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <form onSubmit={handleSubmit}>
          {/* Dark Input Section */}
          <div className="bg-[#363636] p-5 space-y-2">
            <input 
              ref={inputRef}
              type="text"
              placeholder="Task name"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent text-white text-xl font-bold outline-none placeholder:text-gray-500"
            />
            <textarea 
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-gray-300 text-sm outline-none placeholder:text-gray-500 resize-none h-20 scrollbar-hide"
            />
          </div>
          
          {/* Smart Toolbars */}
          <div className="p-4 bg-white relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                
                {/* Date Popover Trigger */}
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setActiveDropdown(activeDropdown === 'date' ? 'none' : 'date')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-xs font-bold transition-all hover:bg-gray-50 ${parsedData.dateText !== 'Today' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'text-gray-600'}`}
                  >
                    <Calendar size={16} className={parsedData.dateText === 'Today' ? 'text-green-600' : 'text-purple-600'} />
                    <span>{parsedData.dateText}</span>
                  </button>
                  {activeDropdown === 'date' && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                      <button type="button" onClick={() => updateContentPart(/(@today|@tomorrow|@\d{4}-\d{2}-\d{2})/, '@today')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 font-medium border-b border-gray-100">
                        <Clock size={16} className="text-green-500" /> Today
                      </button>
                      <button type="button" onClick={() => updateContentPart(/(@today|@tomorrow|@\d{4}-\d{2}-\d{2})/, '@tomorrow')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 font-medium border-b border-gray-100">
                        <ChevronRight size={16} className="text-blue-500" /> Tomorrow
                      </button>
                      <div className="p-2">
                        <input 
                          type="date" 
                          onChange={(e) => updateContentPart(/(@today|@tomorrow|@\d{4}-\d{2}-\d{2})/, `@${e.target.value}`)}
                          className="w-full text-xs p-1 border rounded outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Priority Dropdown Trigger */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'priority' ? 'none' : 'priority')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <Flag size={16} style={{ color: PRIORITIES.find(p => p.val === parsedData.priority)?.color || '#9ca3af' }} fill={PRIORITIES.find(p => p.val === parsedData.priority)?.color} />
                    <span>Priority {parsedData.priority === 4 ? '' : `P${parsedData.priority - 1}`}</span>
                  </button>
                  {activeDropdown === 'priority' && (
                    <div className="absolute bottom-full left-0 mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                      {PRIORITIES.map(p => (
                        <button 
                          key={p.code}
                          type="button" 
                          onClick={() => updateContentPart(/!!([0-4])/, p.code)}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm font-semibold transition-colors"
                          style={{ color: p.color }}
                        >
                          <Flag size={14} fill={p.color} />
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags Dropdown Trigger */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'tags' ? 'none' : 'tags')}
                    className="flex items-center gap-1.5 p-2 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <Tag size={16} />
                    {parsedData.tagCount > 0 && (
                      <span className="flex items-center justify-center min-w-[18px] h-[18px] bg-[#db4c3f] text-white text-[10px] rounded-full px-1">
                        {parsedData.tagCount}
                      </span>
                    )}
                  </button>
                  {activeDropdown === 'tags' && (
                    <div className="absolute bottom-full left-0 mb-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Popular Tags</span>
                      </div>
                      {EXISTING_TAGS.map(tag => (
                        <button 
                          key={tag}
                          type="button" 
                          onClick={() => addTag(tag)}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                        >
                          <Tag size={12} className="text-gray-400" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!content.trim()}
                  className={`px-5 py-2.5 rounded text-white text-sm font-bold shadow-lg transition-all ${
                    content.trim() ? 'bg-[#db4c3f] hover:bg-[#c53727] active:scale-95' : 'bg-red-300 cursor-not-allowed'
                  }`}
                >
                  Add task
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskInline;
