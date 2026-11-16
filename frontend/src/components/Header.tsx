import React from 'react';
import { Search, Upload, Shield, Brain, Sparkles } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
  isAIPanelOpen: boolean;
  onToggleAIPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenUpload,
  onOpenSearch,
  isAIPanelOpen,
  onToggleAIPanel,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0a0f1d] px-5 sm:px-6 flex items-center justify-between z-30 select-none shadow-md">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 hover:scale-105 transition-all duration-300">
          <Brain className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              DocuMind
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-400/30 font-bold shadow-2xs">
              Enterprise AI
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search Bar (Command Palette Trigger) */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-8 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-750 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all duration-200 group shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span className="truncate">
              Tìm kiếm tài liệu &amp; quy định (Ctrl + K)...
            </span>
          </div>
          <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700 shadow-2xs group-hover:border-slate-600">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Primary Actions & User Info */}
      <div className="flex items-center space-x-3">
        {/* Toggle AI Copilot Panel */}
        <button
          onClick={onToggleAIPanel}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
            isAIPanelOpen
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30 ring-1 ring-purple-400/50'
              : 'bg-slate-800 hover:bg-slate-750 text-purple-300 border border-purple-500/30 hover:border-purple-400'
          }`}
          title="Bật/Tắt Trợ Lý AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse-subtle" />
          <span className="hidden sm:inline">AI Copilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={onOpenUpload}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải Lên</span>
        </button>

        <div className="h-4 w-px bg-slate-800" />

        {/* User Info */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-300 shadow-2xs">
            {user.full_name[0]}
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              {user.full_name}
            </div>
            <div className="text-[10px] text-indigo-400 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-indigo-400" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
