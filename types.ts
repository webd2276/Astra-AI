
export interface FileNode {
  id: string;
  name: string;
  content: string;
  language: string;
  isOpen?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: FileNode[];
  lastModified: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
}

export type ViewMode = 'landing' | 'dashboard' | 'chat' | 'ide';
