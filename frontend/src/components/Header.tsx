import React from 'react';
import {
  Search,
  Upload,
  Sparkles,
  Globe,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../services/i18n';

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
  lang?: Language;
  onToggleLang?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenUpload,
  onOpenSearch,
  isAIPanelOpen,
  onToggleAIPanel,
  themeMode = 'light',
  onToggleTheme,
  lang = 'vi',
  onToggleLang,
}) => {
  const t = translations[lang];
  const isLight = themeMode === 'light';

  return (
    <header
      className={`h-14 border-b px-6 flex items-center justify-between z-20 select-none transition-colors duration-200 font-sans ${
        isLight
          ? 'bg-white border-slate-200/80 text-slate-800'
          : 'bg-[#0a0f1d] border-slate-800 text-slate-200 shadow-md'
      }`}
    >
      {/* Breadcrumb Navigation matching neu_career_ai topbar */}
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
          {t.knowledgeSpace}
        </span>
        <span className="text-slate-400 font-normal mx-1">/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {t.regulationsQuery}
        </span>

        {/* Security badge without parentheses */}
        {user.role === 'ADMIN' ? (
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold">
            <Shield className="w-2.5 h-2.5 text-rose-500" />
            <span>{t.adminFull}</span>
          </span>
        ) : (
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
            <span>{t.rbacBadge} {user.department_code || 'STAFF'}</span>
          </span>
        )}
      </div>

      {/* Right Tools Area */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Festive Tet Holiday Badge in Workspace Header */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600/10 via-amber-500/15 to-rose-600/10 text-red-700 dark:text-red-400 border border-red-300/80 dark:border-red-900/60 font-bold text-xs shadow-xs select-none">
          <span>🌸</span>
          <span className="hidden sm:inline">{t.tetBadge}</span>
        </div>

        {/* Quick Search Bar trigger */}
        <button
          onClick={onOpenSearch}
          className={`h-9 px-3 rounded-xl border text-xs flex items-center gap-2 transition-all ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title={t.searchPlaceholder}
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline text-xs">{t.searchPlaceholder}</span>
          <kbd className="hidden lg:inline text-[9px] font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {t.searchShortcut}
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
          title={t.aiCopilot}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span className="hidden sm:inline">{t.aiCopilot}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-[#0066cc] hover:bg-[#0052a3] text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.uploadDoc}</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Language selector matching Image 1: 🌐 VI / EN */}
        {onToggleLang && (
          <button
            type="button"
            onClick={onToggleLang}
            className={`h-9 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                : 'bg-slate-900 border-slate-700 hover:bg-slate-850 text-slate-200'
            }`}
            title={t.switchLang}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="uppercase">{lang}</span>
          </button>
        )}

        {/* Dark / Light Mode Toggle Button ☀️ / 🌙 */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`h-9 w-9 rounded-xl border flex items-center justify-center shadow-xs transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:bg-slate-50 text-amber-500'
                : 'bg-slate-900 border-slate-700 hover:bg-slate-850 text-indigo-400'
            }`}
            title={isLight ? t.themeDark : t.themeLight}
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        )}
      </div>
    </header>
  );
};
