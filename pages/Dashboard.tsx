
import React, { useState } from 'react';
import { Search, Plus, Clock, MessageSquare, Code, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Project, ChatSession } from '../types';

interface DashboardProps {
  projects: Project[];
  sessions: ChatSession[];
  onProjectClick: (id: string) => void;
  onSessionClick: (id: string) => void;
  onNewProject: (prompt?: string) => void;
  onNewSession: () => void;
  isGenerating: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects, sessions, onProjectClick, onSessionClick, onNewProject, onNewSession, isGenerating
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [prompt, setPrompt] = useState('');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleScaffold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onNewProject(prompt);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Astra Central</h1>
            <p className="text-slate-400">Your AI-powered developer hub.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search everything..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* AI Scaffolder */}
        <div className="mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleScaffold} className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">AI Project Scaffolder</label>
                <input 
                  type="text" 
                  disabled={isGenerating}
                  placeholder="Describe your app (e.g., 'A modern weather dashboard with glassmorphism')"
                  className="w-full bg-transparent text-xl font-medium text-slate-100 focus:outline-none placeholder:text-slate-700"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="w-full md:w-auto px-8 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Scaffold Project
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button 
            onClick={() => onNewProject()}
            className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-start gap-4 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
              <Code size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Blank Canvas</h3>
              <p className="text-slate-400 text-sm">Start from scratch with index.html, styles.css, and main.js.</p>
            </div>
          </button>
          <button 
            onClick={onNewSession}
            className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-start gap-4 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
              <MessageSquare size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">AI Consultation</h3>
              <p className="text-slate-400 text-sm">Solve complex logic or plan architecture with Astra.</p>
            </div>
          </button>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Code size={20} className="text-sky-400" />
                Your Workspaces
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProjects.length > 0 ? filteredProjects.map(project => (
                <div 
                  key={project.id}
                  onClick={() => onProjectClick(project.id)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-sky-500/10 group-hover:text-sky-400 transition-colors">
                      <Code size={18} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(project.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold mb-1 text-slate-200 truncate">{project.name}</h4>
                  <p className="text-slate-500 text-xs line-clamp-2">{project.description}</p>
                </div>
              )) : (
                <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-slate-500">No projects yet. Use the scaffolder above!</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={20} className="text-sky-400" />
                History
              </h2>
            </div>
            <div className="space-y-3">
              {filteredSessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => onSessionClick(session.id)}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-200 truncate max-w-[150px]">{session.title}</h5>
                      <span className="text-[10px] text-slate-500">{new Date(session.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
