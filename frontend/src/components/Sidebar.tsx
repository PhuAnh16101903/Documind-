import React, { useState } from 'react';
import {
  FolderTree,
  MessageSquareText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Activity,
} from 'lucide-react';
import { Department, UIThemeId, User } from '../types';
import { Language, translations } from '../services/i18n';
import { Brand } from './Brand';

interface SidebarProps {
  departments: Department[];
  selectedDeptId: number | null;
  onSelectDept: (id: number | null) => void;
  activeTab: 'knowledge' | 'copilot' | 'analytics';
  onSelectTab: (tab: 'knowledge' | 'copilot' | 'analytics') => void;
  user: User;
  onOpenSettings: () => void;
  onLogout: () => void;
  currentTheme?: UIThemeId;
  themeMode?: 'light' | 'dark';
  lang?: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  departments,
  selectedDeptId,
  onSelectDept,
  activeTab,
  onSelectTab,
  user,
  onOpenSettings,
  onLogout,
  themeMode = 'light',
  lang = 'vi',
}) => {
  const t = translations[lang];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLight = themeMode === 'light';

  const navItems = [
    {
      id: 'knowledge' as const,
      label: t.navKnowledge,
      icon: FolderTree,
      badge: 'RAG Ready',
      badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/60',
    },
    {
      id: 'copilot' as const,
      label: t.navCopilot,
      icon: MessageSquareText,
      badge: 'Gemini 3.8 ★',
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300/60 dark:border-purple-700/60',
    },
    {
      id: 'analytics' as const,
      label: t.navAnalytics,
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/60',
    },
  ];

  const getDeptBadge = (code: string) => {
    switch (code) {
      case 'HR':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
      case 'FIN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'TECH':
        return 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
    }
  };

  const getDeptDot = (code: string) => {
    switch (code) {
      case 'HR':
        return 'bg-rose-500';
      case 'FIN':
        return 'bg-emerald-500';
      case 'TECH':
        return 'bg-sky-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <aside
      className={`border-r select-none z-20 flex flex-col justify-between transition-all duration-300 relative font-sans ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isLight
          ? 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-800 shadow-sm'
          : 'bg-[#0a0f1d] border-slate-800/90 text-slate-200 shadow-xl'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3.5 top-5 w-7 h-7 rounded-full border shadow-md flex items-center justify-center transition-all duration-200 z-30 hover:scale-110 active:scale-95 cursor-pointer ${
          isLight
            ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:border-blue-400'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-blue-400'
        }`}
        title={isCollapsed ? t.expandSidebar : t.collapseSidebar}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Brand Logo with Authentic Circular NEU Emblem */}
      <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <Brand isCollapsed={isCollapsed} lang={lang} />
      </div>

      {/* Luxury Tet Holiday Badge in Sidebar */}
      {!isCollapsed && (
        <div className="mx-3 mt-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/10 via-amber-500/15 to-rose-600/10 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-between text-[11px] font-extrabold text-red-700 dark:text-red-400 shadow-xs hover:border-amber-400 transition-all">
          <span className="flex items-center gap-1.5">
            <span className="text-sm">🌸</span>
            <span>Xuân Bính Ngọ</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/80 flex items-center gap-1">
            <span>2026</span>
            <span>🇻🇳</span>
          </span>
        </div>
      )}

      {/* Navigation Links Area */}
      <div className="flex-1 p-3 space-y-5 overflow-y-auto">
        {/* Main Workspaces */}
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0066cc] via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold scale-[1.01]'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-xs'
                        : isLight
                        ? 'bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50'
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="truncate text-xs">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border font-bold flex-shrink-0 transition-opacity ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : `${item.badgeColor} border opacity-80 group-hover:opacity-100`
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Departments Section */}
        {!isCollapsed && (
          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>{t.deptSection}</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold">
                ACTIVE
              </span>
            </div>

            <button
              onClick={() => onSelectDept(null)}
              className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-200 cursor-pointer ${
                selectedDeptId === null
                  ? isLight
                    ? 'bg-gradient-to-r from-blue-50 via-indigo-50/50 to-transparent border-l-2 border-[#0066cc] text-blue-900 font-bold shadow-2xs'
                    : 'bg-gradient-to-r from-blue-950/60 via-indigo-950/30 to-transparent border-l-2 border-blue-500 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${selectedDeptId === null ? 'bg-[#0066cc]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span>{t.allDepts}</span>
              </div>
              <span className="text-[10px] font-mono opacity-60">All</span>
            </button>

            {departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              const cleanDeptName =
                lang === 'en' && dept.name_en
                  ? dept.name_en
                  : dept.name.replace(/\s*\(.*?\)\s*/g, '');

              return (
                <button
                  key={dept.id}
                  onClick={() => onSelectDept(dept.id)}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-gradient-to-r from-blue-50 via-indigo-50/50 to-transparent border-l-2 border-[#0066cc] text-blue-900 font-bold shadow-2xs'
                        : 'bg-gradient-to-r from-blue-950/60 via-indigo-950/30 to-transparent border-l-2 border-blue-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDeptDot(dept.code)}`} />
                    <span className="truncate">{cleanDeptName}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${getDeptBadge(dept.code)}`}>
                    {dept.code}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 group cursor-pointer ${
            isLight
              ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title={t.settings}
        >
          <Settings className="w-4 h-4 text-slate-500 flex-shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          {!isCollapsed && <span>{t.settings}</span>}
        </button>

        {/* User Card with glowing status */}
        <div
          className={`p-2.5 rounded-2xl flex items-center gap-2.5 transition-all border ${
            isLight
              ? 'bg-slate-50/90 border-slate-200/80 shadow-2xs'
              : 'bg-slate-800/80 border-slate-700/60 shadow-md'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-slate-800">
              {user.full_name ? user.full_name[0].toUpperCase() : 'P'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800 animate-pulse" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.full_name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-bold px-1 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {user.role === 'ADMIN' ? 'ADMIN' : (user.department_code || 'STAFF')}
                </span>
                <span className="truncate">
                  {user.role === 'ADMIN'
                    ? lang === 'vi' ? 'Quản trị viên' : 'Administrator'
                    : (lang === 'en' && user.department_name_en ? user.department_name_en : user.department_name || 'Staff')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Logout button in Red */}
        <button
          onClick={onLogout}
          className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
          title={t.logout}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>{t.logout}</span>}
        </button>
      </div>
    </aside>
  );
};
