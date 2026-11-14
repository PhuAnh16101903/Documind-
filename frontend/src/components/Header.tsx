import React from 'react';
import { Search, Upload, Bell, Shield, Sparkles } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenUpload, onOpenSearch }) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md px-5 flex items-center justify-between z-30">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-white">DocuMind</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.1 Enterprise
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Kho Tri Thức Doanh Nghiệp &amp; Hệ Thống Truy Xuất AI Có Kiểm Chứng
          </p>
        </div>
      </div>

      {/* Quick Search Bar (Command Palette Trigger) */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-8 px-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 flex items-center justify-between transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Tìm kiếm tài liệu bằng từ khóa hoặc ý nghĩa...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Action Buttons & User Profile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenUpload}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Tài Liệu</span>
        </button>

        <div className="h-4 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">
            {user.full_name[0]}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-semibold text-slate-200 leading-tight">{user.full_name}</div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
