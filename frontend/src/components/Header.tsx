import React from 'react';
import { Search, Upload, Shield, Sparkles, Activity, Layers, Palette } from 'lucide-react';
import { User, UIThemeId } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { THEMES } from '../theme/themes';

interface HeaderProps {
  user: User;
  currentTheme: UIThemeId;
  onSelectTheme: (themeId: UIThemeId) => void;
  onOpenUpload: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentTheme,
  onSelectTheme,
  onOpenUpload,
  onOpenSearch,
}) => {
  const activeTheme = THEMES[currentTheme];

  return (
    <header className={`h-16 border-b ${activeTheme.borderClass} ${activeTheme.surfaceClass} px-5 sm:px-6 flex items-center justify-between z-30 relative select-none transition-colors duration-300`}>
      {/* Top subtle glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${activeTheme.accentColor}80, transparent)`,
        }}
      />

      {/* Brand & Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="relative group">
          <div
            className="absolute -inset-0.5 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"
            style={{ backgroundColor: activeTheme.accentColor }}
          />
          <div
            className="relative w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300"
            style={{ backgroundColor: activeTheme.accentColor }}
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse-subtle" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-base tracking-tight text-white">
              DocuMind
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/20 shadow-sm">
              v2.0 Enterprise
            </span>
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>RAG ACTIVE</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 hidden xl:block tracking-normal font-medium">
            Kho Tri Thức Doanh Nghiệp &amp; Hệ Thống Truy Xuất AI Có Kiểm Chứng
          </p>
        </div>
      </div>

      {/* Quick Search Bar (Command Palette Trigger) */}
      <div className="flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-6 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.08] hover:border-white/20 text-xs text-slate-400 flex items-center justify-between transition-all duration-200 group shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
            <span className="group-hover:text-slate-300 transition-colors truncate">
              Tìm theo từ khóa hoặc ý nghĩa (Hybrid Search)...
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <kbd className="text-[10px] font-mono bg-slate-800/90 px-1.5 py-0.5 rounded-md text-slate-400 border border-white/[0.08]">
              Ctrl + K
            </kbd>
          </div>
        </button>
      </div>

      {/* UI Theme Switcher & Actions */}
      <div className="flex items-center space-x-3">
        {/* Dynamic Theme Switcher Dropdown */}
        <ThemeSwitcher
          currentTheme={currentTheme}
          onSelectTheme={onSelectTheme}
        />

        <button
          onClick={onOpenUpload}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 active:scale-95 transition-all duration-200 ${activeTheme.buttonClass}`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Upload File</span>
        </button>

        <div className="h-5 w-px bg-white/[0.08]" />

        {/* User Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-200 shadow-sm">
              {user.full_name[0]}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div className="hidden 2xl:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              {user.full_name}
            </div>
            <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5 text-cyan-400" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
