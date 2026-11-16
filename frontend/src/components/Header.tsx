import React from 'react';
import { Search, Upload, Shield, Brain } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenUpload,
  onOpenSearch,
}) => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-5 sm:px-6 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 hover:scale-105 transition-all duration-300">
          <Brain className="w-4 h-4 animate-pulse-subtle" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
              DocuMind
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/80 font-bold shadow-2xs">
              Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search Bar (Command Palette Trigger) */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-8 px-3 rounded-lg bg-slate-100/80 hover:bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs text-xs text-slate-600 flex items-center justify-between transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="group-hover:text-slate-900 truncate">
              Tìm kiếm tài liệu &amp; quy định (Ctrl + K)...
            </span>
          </div>
          <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 shadow-2xs group-hover:border-indigo-200">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Primary Actions & User Info */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenUpload}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải Lên</span>
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 shadow-2xs">
            {user.full_name[0]}
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {user.full_name}
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-indigo-600" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
