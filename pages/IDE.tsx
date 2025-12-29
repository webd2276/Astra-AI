
import React, { useState, useEffect } from 'react';
import { 
  File, 
  Folder, 
  Play, 
  Save, 
  Share2, 
  Terminal, 
  Eye, 
  Settings, 
  ChevronDown, 
  Code2, 
  Plus,
  Sparkles,
  Zap,
  Info,
  Loader2
} from 'lucide-react';
import { Project, FileNode } from '../types';
import { refactorCode, generateAIResponse } from '../geminiService';

interface IDEProps {
  project: Project | null;
  activeFile: FileNode | null;
  onFileSelect: (id: string) => void;
  onUpdateContent: (fileId: string, content: string) => void;
  onNewFile: () => void;
}

export const IDE: React.FC<IDEProps> = ({ 
  project, activeFile, onFileSelect, onUpdateContent, onNewFile 
}) => {
  const [rightPanel, setRightPanel] = useState<'preview' | 'terminal' | 'ai'>('preview');
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [previewKey, setPreviewKey] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  if (!project) return (
    <div className="flex-1 flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-600">
          <Code2 size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">No Active Project</h3>
        <p className="text-slate-500">Select a project from the dashboard to start coding.</p>
      </div>
    </div>
  );

  const handleRefactor = async (type: 'optimize' | 'comments' | 'bug') => {
    if (!activeFile || aiLoading) return;
    setAiLoading(true);
    setRightPanel('ai');
    setAiFeedback("Astra is analyzing your code...");

    let prompt = "";
    if (type === 'optimize') prompt = "Optimize this code for performance and readability.";
    if (type === 'comments') prompt = "Add helpful JSDoc/CSS comments to this file.";
    if (type === 'bug') prompt = "Check for potential bugs or security vulnerabilities and fix them.";

    const newCode = await refactorCode(activeFile.content, prompt);
    if (newCode) {
      onUpdateContent(activeFile.id, newCode);
      setAiFeedback(`Task complete: ${type.charAt(0).toUpperCase() + type.slice(1)} applied successfully.`);
    } else {
      setAiFeedback("AI failed to process. Try again.");
    }
    setAiLoading(false);
  };

  const handleExplain = async () => {
    if (!activeFile || aiLoading) return;
    setAiLoading(true);
    setRightPanel('ai');
    setAiFeedback(null);
    const explanation = await generateAIResponse(
      `Explain exactly what this file does in a concise, developer-friendly way. 
      FILE: ${activeFile.name}
      CODE:
      ${activeFile.content}`
    );
    setAiFeedback(explanation || "Failed to explain.");
    setAiLoading(false);
  };

  const generatePreviewDoc = () => {
    const html = project.files.find(f => f.name === 'index.html')?.content || '';
    const css = project.files.find(f => f.name === 'styles.css')?.content || '';
    const js = project.files.find(f => f.name === 'main.js')?.content || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center text-[10px] font-bold text-white">P</div>
            <span className="text-sm font-semibold truncate max-w-[150px]">{project.name}</span>
          </div>
          <div className="h-4 w-px bg-slate-800 mx-2"></div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPreviewKey(prev => prev + 1)}
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              <Play size={14} fill="white" />
              Run
            </button>
            <div className="flex gap-0.5 ml-2">
              <button 
                onClick={() => handleRefactor('optimize')}
                title="AI Optimize"
                className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-all"
              >
                <Sparkles size={18} />
              </button>
              <button 
                onClick={handleExplain}
                title="AI Explain"
                className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-all"
              >
                <Info size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-all">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div 
          style={{ width: sidebarWidth }} 
          className="bg-slate-900 border-r border-slate-800 flex flex-col shrink-0"
        >
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Explorer</span>
            <button onClick={onNewFile} className="p-1 text-slate-500 hover:text-slate-200">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-slate-300 mb-1">
              <ChevronDown size={14} />
              <Folder size={16} className="text-sky-400" />
              <span className="font-medium">root</span>
            </div>
            <div className="ml-4 space-y-0.5">
              {project.files.map(file => (
                <button
                  key={file.id}
                  onClick={() => onFileSelect(file.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    activeFile?.id === file.id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <File size={14} />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
          <div className="h-10 border-b border-slate-900 flex items-center px-4 gap-1 overflow-x-auto no-scrollbar bg-slate-900/50">
            {project.files.map(file => (
              <button 
                key={file.id}
                onClick={() => onFileSelect(file.id)}
                className={`flex items-center gap-2 h-full text-[11px] font-medium px-3 border-b-2 transition-all whitespace-nowrap ${
                  activeFile?.id === file.id ? 'border-sky-500 text-sky-400 bg-sky-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <File size={12} />
                {file.name}
              </button>
            ))}
          </div>
          <div className="flex-1 relative font-mono text-[13px] group">
            <textarea
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-transparent p-6 pl-14 text-slate-300 resize-none focus:outline-none custom-scrollbar leading-relaxed"
              value={activeFile?.content || ''}
              onChange={(e) => activeFile && onUpdateContent(activeFile.id, e.target.value)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-900/30 border-r border-slate-900 flex flex-col items-center pt-6 text-[10px] text-slate-600 select-none pointer-events-none">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="h-6 leading-relaxed">{i + 1}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel (Preview/AI/Terminal) */}
        <div className="w-[420px] border-l border-slate-800 flex flex-col bg-slate-900 shrink-0">
          <div className="h-10 flex border-b border-slate-800 bg-slate-900/80">
            {[
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'ai', label: 'Astra AI', icon: Sparkles },
              { id: 'terminal', label: 'Terminal', icon: Terminal }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setRightPanel(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 text-[11px] font-bold transition-all ${
                  rightPanel === tab.id ? 'text-sky-400 bg-slate-950 border-b-2 border-sky-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 relative overflow-hidden">
            {rightPanel === 'preview' && (
              <div className="w-full h-full bg-white">
                <iframe 
                  key={previewKey}
                  title="Preview"
                  className="w-full h-full border-none"
                  srcDoc={generatePreviewDoc()}
                />
              </div>
            )}
            {rightPanel === 'ai' && (
              <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h4 className="font-bold text-sm">Astra Intelligence</h4>
                </div>
                
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-sm gap-4">
                    <Loader2 className="animate-spin text-sky-400" size={32} />
                    <p>{aiFeedback || "Thinking..."}</p>
                  </div>
                ) : aiFeedback ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{aiFeedback}</p>
                    <button 
                      onClick={() => setAiFeedback(null)}
                      className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-lg transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-500 text-xs mb-4">Analyze or modify <span className="text-sky-400 font-mono">{activeFile?.name}</span> with AI power.</p>
                    <button 
                      onClick={handleExplain}
                      className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-sky-500/5 text-left transition-all group"
                    >
                      <h5 className="font-bold text-xs text-slate-200 group-hover:text-sky-400 mb-1">Explain Code</h5>
                      <p className="text-[11px] text-slate-500">Get a clear walk-through of logic and architecture.</p>
                    </button>
                    <button 
                      onClick={() => handleRefactor('optimize')}
                      className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-sky-500/5 text-left transition-all group"
                    >
                      <h5 className="font-bold text-xs text-slate-200 group-hover:text-sky-400 mb-1">Optimize Structure</h5>
                      <p className="text-[11px] text-slate-500">Improve performance and reduce code complexity.</p>
                    </button>
                    <button 
                      onClick={() => handleRefactor('comments')}
                      className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-sky-500/5 text-left transition-all group"
                    >
                      <h5 className="font-bold text-xs text-slate-200 group-hover:text-sky-400 mb-1">Add Documentation</h5>
                      <p className="text-[11px] text-slate-500">Auto-generate comments and API documentation.</p>
                    </button>
                  </div>
                )}
              </div>
            )}
            {rightPanel === 'terminal' && (
              <div className="w-full h-full bg-slate-950 p-6 font-mono text-[11px] text-emerald-500 overflow-y-auto custom-scrollbar">
                <div className="flex gap-2 mb-2">
                  <span className="text-sky-400">astra@v3.1:</span>
                  <span className="text-slate-400">~/projects/{project.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
                <div className="mb-2 text-slate-600 italic">Starting AI runtime...</div>
                <div className="flex gap-2">
                  <span className="text-slate-100">$</span>
                  <span className="text-slate-100">npm run dev</span>
                </div>
                <div className="mt-2 text-slate-500">
                  Ready in 0.8s. Preview is active.<br />
                  Watching for changes...
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="text-slate-100 animate-pulse">_</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
