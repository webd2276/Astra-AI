
import React from 'react';
import { Rocket, Zap, Globe, Github, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 overflow-y-auto custom-scrollbar">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-400 poppins">Astra AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
          <a href="#" className="hover:text-sky-400 transition-colors">Features</a>
          <a href="#" className="hover:text-sky-400 transition-colors">Pricing</a>
          <a href="#" className="hover:text-sky-400 transition-colors">Team</a>
        </div>
        <button 
          onClick={onStart}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-full font-semibold transition-all"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8"
        >
          <Zap size={14} />
          <span>New: Gemini 3 Pro Engine Integrated</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight max-w-5xl poppins"
        >
          Build Faster with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 animate-gradient">Intelligent Agency</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          The first hybrid Dev-AI platform that thinks like an engineer. Chat with Astra, build full-stack projects, and deploy in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-xl shadow-sky-500/20"
          >
            Get Started Free
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-lg transition-all border border-slate-700 flex items-center justify-center gap-2">
            <Github size={20} />
            Star on GitHub
          </button>
        </motion.div>

        {/* Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 w-full max-w-6xl relative"
        >
          <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-950/50 rounded-t-xl border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="mx-auto text-xs text-slate-500 font-mono">astra-agent-ai/dashboard</div>
            </div>
            <img 
              src="https://picsum.photos/seed/astra-ide/1600/900" 
              alt="IDE Preview" 
              className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-12 bg-slate-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Rocket, title: "Instant Scaffolding", desc: "Start projects with AI-generated boilerplate code in any framework." },
            { icon: Globe, title: "Global Context", desc: "Astra understands your entire codebase, not just the current file." },
            { icon: Zap, title: "Real-time Collaboration", desc: "Edit code together with your team and Astra in a shared environment." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/30 transition-all group">
              <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-100">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Astra Agent AI. Built for the future of software engineering.</p>
      </footer>
    </div>
  );
};
