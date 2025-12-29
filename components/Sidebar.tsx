
import React from 'react';
import { Home, MessageSquare, Code, Settings, Plus, LayoutGrid } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onNewAction: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onNewAction }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'ide', icon: Code, label: 'Project IDE' },
  ];

  return (
    <div className="w-16 md:w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 h-full">
      <div 
        className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl mb-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        onClick={() => onViewChange('landing')}
      >
        <span className="text-white font-bold text-xl">A</span>
      </div>

      <nav className="flex flex-col gap-6 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewMode)}
            className={`p-3 rounded-xl transition-all duration-200 group relative ${
              currentView === item.id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <item.icon size={24} />
            <span className="absolute left-16 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-6">
        <button 
          onClick={onNewAction}
          className="p-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition-all shadow-lg shadow-sky-500/20"
        >
          <Plus size={24} />
        </button>
        <button className="p-3 text-slate-400 hover:text-slate-100 transition-all">
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
};
