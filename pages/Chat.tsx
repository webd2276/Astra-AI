
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { ChatSession } from '../types';
import { generateAIStream } from '../geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatProps {
  session: ChatSession | null;
  sessions: ChatSession[];
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onSendMessage: (content: string) => void;
  onAddAssistantMessage: (content: string) => void;
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ 
  session, sessions, onNewSession, onSelectSession, onSendMessage, onAddAssistantMessage, onBack
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, streamingText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || isTyping) return;

    const userPrompt = input;
    setInput('');
    onSendMessage(userPrompt);
    setIsTyping(true);
    setStreamingText('');

    await generateAIStream(userPrompt, session.messages, (text) => {
      setStreamingText(text);
    });

    onAddAssistantMessage(streamingText);
    setStreamingText('');
    setIsTyping(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      {/* Sessions Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900/50 border-r border-slate-800">
        <div className="p-4">
          <button 
            onClick={onNewSession}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`w-full p-3 text-left rounded-xl transition-all group ${
                session?.id === s.id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquareIcon size={16} />
                <span className="truncate text-sm font-medium">{s.title}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="lg:hidden p-2 text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-lg text-slate-100 truncate max-w-[200px] md:max-w-md">
              {session?.title || 'Select a Conversation'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-8">
          {!session && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mb-6">
                <Bot size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">I am Astra</h3>
              <p className="text-slate-400 max-w-sm">How can I help you build your project today? Select a session or start a new one.</p>
            </div>
          )}

          {session?.messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-4 md:gap-6 ${msg.role === 'assistant' ? 'bg-slate-900/40 p-6 rounded-3xl border border-slate-800' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-slate-800 text-slate-400' : 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-code:text-sky-400">
                  <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-base">
                    {msg.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && streamingText && (
            <div className="flex gap-4 md:gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                <Bot size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                    {streamingText}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <form 
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-sky-500/5 blur-xl rounded-2xl group-focus-within:bg-sky-500/10 transition-all"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-sky-500/50 shadow-2xl transition-all">
              <textarea 
                rows={1}
                placeholder="Ask Astra to build a login page or debug a function..."
                className="w-full bg-transparent px-6 py-5 text-slate-100 resize-none focus:outline-none placeholder:text-slate-600 min-h-[60px] max-h-[200px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
                <div className="flex gap-2">
                  <span className="text-[10px] text-slate-600 font-mono">Shift + Enter for new line</span>
                </div>
                <button 
                  disabled={!input.trim() || isTyping}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isTyping ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MessageSquareIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
