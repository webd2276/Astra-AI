
import { useState, useEffect } from 'react';
import { Project, ChatSession, ViewMode, FileNode } from './types';
import { scaffoldProject } from './geminiService';

const STORAGE_KEY = 'astra_agent_data';

export const useAstraStore = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProjects(data.projects || []);
      setSessions(data.sessions || []);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, sessions }));
  }, [projects, sessions]);

  const createProject = async (name: string, prompt?: string) => {
    if (prompt) {
      setIsGenerating(true);
      const scaffold = await scaffoldProject(prompt);
      setIsGenerating(false);
      
      if (scaffold) {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          description: scaffold.description,
          lastModified: Date.now(),
          files: scaffold.files.map((f: any) => ({
            ...f,
            id: crypto.randomUUID()
          }))
        };
        setProjects(prev => [newProject, ...prev]);
        return newProject;
      }
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description: 'Handcrafted project',
      lastModified: Date.now(),
      files: [
        { id: 'index-html', name: 'index.html', language: 'html', content: '<!-- Build something amazing -->\n<div id="root">Hello Astra!</div>' },
        { id: 'styles-css', name: 'styles.css', language: 'css', content: 'body { font-family: sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }' },
        { id: 'main-js', name: 'main.js', language: 'javascript', content: 'console.log("Astra Agent ready.");' }
      ]
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const createSession = (title: string = 'New Conversation') => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title,
      messages: [],
      lastModified: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const updateFileContent = (projectId: string, fileId: string, content: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          lastModified: Date.now(),
          files: p.files.map(f => f.id === fileId ? { ...f, content } : f)
        };
      }
      return p;
    }));
  };

  const addMessageToSession = (sessionId: string, role: 'user' | 'assistant', content: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          lastModified: Date.now(),
          messages: [...s.messages, { id: crypto.randomUUID(), role, content, timestamp: Date.now() }]
        };
      }
      return s;
    }));
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const activeFile = activeProject?.files.find(f => f.id === activeFileId) || activeProject?.files[0] || null;

  return {
    viewMode, setViewMode,
    projects, setProjects,
    sessions, setSessions,
    activeProjectId, setActiveProjectId,
    activeSessionId, setActiveSessionId,
    activeFileId, setActiveFileId,
    activeProject, activeSession, activeFile,
    createProject, createSession, updateFileContent, addMessageToSession,
    isGenerating
  };
};
