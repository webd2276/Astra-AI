
import React from 'react';
import { useAstraStore } from './store';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { IDE } from './pages/IDE';
import { Sidebar } from './components/Sidebar';
import { ViewMode } from './types';

const App: React.FC = () => {
  const store = useAstraStore();

  const handleStart = () => {
    store.setViewMode('dashboard');
  };

  const handleProjectClick = (id: string) => {
    store.setActiveProjectId(id);
    store.setViewMode('ide');
  };

  const handleSessionClick = (id: string) => {
    store.setActiveSessionId(id);
    store.setViewMode('chat');
  };

  const handleNewProject = async (prompt?: string) => {
    const p = await store.createProject(prompt ? 'AI Project' : 'New Astra Project', prompt);
    if (p) {
      store.setActiveProjectId(p.id);
      store.setViewMode('ide');
    }
  };

  const handleNewSession = () => {
    const s = store.createSession('New Discussion');
    store.setActiveSessionId(s.id);
    store.setViewMode('chat');
  };

  const renderContent = () => {
    switch (store.viewMode) {
      case 'landing':
        return <Landing onStart={handleStart} />;
      case 'dashboard':
        return (
          <Dashboard 
            projects={store.projects}
            sessions={store.sessions}
            onProjectClick={handleProjectClick}
            onSessionClick={handleSessionClick}
            onNewProject={handleNewProject}
            onNewSession={handleNewSession}
            isGenerating={store.isGenerating}
          />
        );
      case 'chat':
        return (
          <Chat 
            session={store.activeSession}
            sessions={store.sessions}
            onNewSession={handleNewSession}
            onSelectSession={store.setActiveSessionId}
            onSendMessage={(c) => store.addMessageToSession(store.activeSessionId!, 'user', c)}
            onAddAssistantMessage={(c) => store.addMessageToSession(store.activeSessionId!, 'assistant', c)}
            onBack={() => store.setViewMode('dashboard')}
          />
        );
      case 'ide':
        return (
          <IDE 
            project={store.activeProject}
            activeFile={store.activeFile}
            onFileSelect={store.setActiveFileId}
            onUpdateContent={(fileId, content) => {
              if (store.activeProjectId) {
                store.updateFileContent(store.activeProjectId, fileId, content);
              }
            }}
            onNewFile={() => {}} 
          />
        );
      default:
        return <Landing onStart={handleStart} />;
    }
  };

  if (store.viewMode === 'landing') {
    return <Landing onStart={handleStart} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar 
        currentView={store.viewMode}
        onViewChange={store.setViewMode}
        onNewAction={() => store.viewMode === 'chat' ? handleNewSession() : handleNewProject()}
      />
      <main className="flex-1 flex flex-col relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
