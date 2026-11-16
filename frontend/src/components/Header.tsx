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
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
          <Brain className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-slate-900">
              DocuMind
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search Bar (Command Palette Trigger) */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs text-slate-600 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="group-hover:text-slate-900 truncate">
              Tìm kiếm tài liệu &amp; quy định (Ctrl + K)...
            </span>
          </div>
          <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Primary Actions & User Info */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenUpload}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
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
