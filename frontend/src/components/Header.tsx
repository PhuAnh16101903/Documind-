import React from 'react';
import { Search, Upload, Shield, Sparkles, Activity, Layers } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenUpload, onOpenSearch }) => {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#090e1a]/80 backdrop-blur-xl px-6 flex items-center justify-between z-30 relative select-none">
      {/* Top subtle glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Brand & Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4 text-white animate-pulse-subtle" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-base tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              DocuMind
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10">
              v2.0 Enterprise
            </span>
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>VERIFIED RAG ACTIVE</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block tracking-normal font-medium">
            Kho Tri Thức Doanh Nghiệp &amp; Hệ Thống Truy Xuất AI Có Kiểm Chứng
          </p>
        </div>
      </div>

      {/* Command Palette Trigger (Impeccable & Evondev standard) */}
      <div className="flex-1 max-w-lg mx-8 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/[0.08] hover:border-indigo-500/40 text-xs text-slate-400 flex items-center justify-between transition-all duration-200 group shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span className="group-hover:text-slate-300 transition-colors">
              Tìm kiếm tài liệu bằng từ khóa hoặc ý nghĩa (Hybrid Search)...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="text-[10px] font-mono bg-slate-800/90 group-hover:bg-indigo-950/60 group-hover:text-indigo-300 px-1.5 py-0.5 rounded-md text-slate-400 border border-white/[0.08] shadow-sm transition-colors">
              Ctrl
            </kbd>
            <span className="text-[10px] text-slate-500">+</span>
            <kbd className="text-[10px] font-mono bg-slate-800/90 group-hover:bg-indigo-950/60 group-hover:text-indigo-300 px-1.5 py-0.5 rounded-md text-slate-400 border border-white/[0.08] shadow-sm transition-colors">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Actions & User Identity */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onOpenUpload}
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold rounded-xl group bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 hover:text-white shadow-md shadow-indigo-600/25 active:scale-95 transition-transform"
        >
          <span className="relative px-3.5 py-1.5 transition-all ease-in duration-150 bg-indigo-600 group-hover:bg-transparent rounded-[10px] flex items-center gap-2 text-white">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Upload Tài Liệu</span>
          </span>
        </button>

        <div className="h-5 w-px bg-white/[0.08]" />

        {/* User Card */}
        <div className="flex items-center space-x-3 pl-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-300 shadow-sm">
              {user.full_name[0]}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090e1a]" />
          </div>

          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              {user.full_name}
            </div>
            <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5 text-cyan-400" />
              <span>{user.role}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">All Depts</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
