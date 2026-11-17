import React from 'react';
import {
  Search,
  Upload,
  Brain,
  Sparkles,
  Globe,
  Sun,
  Moon,
  ChevronRight,
  Shield,
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
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenUpload,
  onOpenSearch,
  isAIPanelOpen,
  onToggleAIPanel,
  themeMode = 'light',
  onToggleTheme,
}) => {
  const isLight = themeMode === 'light';

  return (
    <header
      className={`h-14 border-b px-6 flex items-center justify-between z-20 select-none transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200/80 text-slate-800'
          : 'bg-[#0a0f1d] border-slate-800 text-slate-200 shadow-md'
      }`}
    >
      {/* Breadcrumb Navigation matching Reference Image 1 */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
          Không gian tri thức
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-bold">
          Tra cứu quy chế &amp; So khớp điều khoản
        </span>

        {/* Security badge */}
        {user.role === 'ADMIN' ? (
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold">
            <Shield className="w-2.5 h-2.5 text-rose-500" />
            <span>ADMIN FULL</span>
          </span>
        ) : (
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
            <span>RBAC: {user.department_code || 'STAFF'}</span>
          </span>
        )}
      </div>

      {/* Right Tools Area matching Reference Image 1 */}
      <div className="flex items-center space-x-2.5">
        {/* Quick Search Bar trigger */}
        <button
          onClick={onOpenSearch}
          className={`h-9 px-3 rounded-xl border text-xs flex items-center gap-2 transition-all ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Tìm kiếm tài liệu & quy định (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline text-xs">Tìm kiếm (Ctrl + K)...</span>
          <kbd className="hidden lg:inline text-[9px] font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            Ctrl K
          </kbd>
        </button>

        {/* Toggle AI Copilot Panel */}
        <button
          onClick={onToggleAIPanel}
          className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
            isAIPanelOpen
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20'
              : isLight
              ? 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100'
              : 'bg-slate-800 border border-purple-500/30 text-purple-300 hover:bg-slate-750'
          }`}
          title="Bật/Tắt Trợ Lý AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span className="hidden sm:inline">AI Copilot</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-[#0066cc] hover:bg-[#0052a3] text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tải Lên</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Language selector matching Image 1: 🌐 VI */}
        <button
          type="button"
          className={`h-9 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
            isLight
              ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              : 'bg-slate-900 border-slate-700 hover:bg-slate-850 text-slate-200'
          }`}
          title="Ngôn ngữ hệ thống"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>VI</span>
        </button>

        {/* Dark / Light Mode Toggle Button ☀️ / 🌙 matching Image 1 */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`h-9 w-9 rounded-xl border flex items-center justify-center shadow-xs transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50 text-amber-500'
                : 'bg-slate-900 border-slate-700 hover:bg-slate-850 text-indigo-400'
            }`}
            title={isLight ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        )}
      </div>
    </header>
  );
};
