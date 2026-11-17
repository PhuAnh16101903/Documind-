import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Upload,
  Shield,
  Brain,
  Sparkles,
  Settings,
  LogOut,
  ChevronDown,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
  isAIPanelOpen: boolean;
  onToggleAIPanel: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenUpload,
  onOpenSearch,
  isAIPanelOpen,
  onToggleAIPanel,
  onOpenSettings,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-slate-800 bg-[#0a0f1d] px-5 sm:px-6 flex items-center justify-between z-30 select-none shadow-md relative">
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
            {user.role === 'ADMIN' ? (
              <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                <Shield className="w-2.5 h-2.5 text-rose-400" />
                <span>ADMIN FULL-ACCESS</span>
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>RBAC: {user.department_code || 'DEPT'}</span>
              </span>
            )}
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

        {/* User Profile Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all text-left group"
            title="Tài khoản cá nhân & Cài đặt (Nhấp để mở menu)"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-white shadow-2xs group-hover:scale-105 transition-transform">
              {user.full_name[0]}
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight group-hover:text-white transition-colors flex items-center gap-1">
                <span>{user.full_name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform duration-200" />
              </div>
              <div className="text-[10px] text-indigo-400 flex items-center gap-1 font-mono">
                <Shield className="w-2.5 h-2.5 text-indigo-400" />
                <span>{user.role === 'ADMIN' ? 'ADMIN (Level 3)' : (user.department_name || user.role)}</span>
              </div>
            </div>
          </button>

          {/* Profile Dropdown Menu (Cài đặt & Đăng xuất) */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 animate-fade-in text-xs font-sans">
              {/* User summary header */}
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60">
                <div className="font-bold text-white text-xs truncate">
                  {user.full_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                  {user.email}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Building className="w-2.5 h-2.5" />
                  <span>{user.department_name || 'Quản trị viên hệ thống'}</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors group"
                >
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <div className="flex-1">
                    <div className="font-semibold text-xs">Cài Đặt Hệ Thống</div>
                    <div className="text-[10px] text-slate-400">Tùy chỉnh cá nhân, token &amp; AI</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors group"
                >
                  <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-colors" />
                  <div>
                    <div className="font-semibold text-xs">Đăng Xuất</div>
                    <div className="text-[10px] text-rose-400/70">Thoát khỏi phiên làm việc hiện tại</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
