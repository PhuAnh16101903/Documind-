import React, { useState } from 'react';
import {
  FolderTree,
  MessageSquareText,
  BarChart3,
  GitCompare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  Brain,
  Shield,
} from 'lucide-react';
import { Department, UIThemeId, User } from '../types';

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
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLight = themeMode === 'light';

  const navItems = [
    {
      id: 'knowledge' as const,
      label: 'Kho Tri Thức & Quy Chế',
      shortLabel: 'Kho Tri Thức',
      icon: FolderTree,
    },
    {
      id: 'copilot' as const,
      label: 'AI Copilot & Đối Chiếu',
      shortLabel: 'AI Copilot',
      icon: MessageSquareText,
    },
    {
      id: 'analytics' as const,
      label: 'Nhật Ký & Dashboard',
      shortLabel: 'Dashboard',
      icon: BarChart3,
    },
  ];

  const getDeptBadge = (code: string) => {
    switch (code) {
      case 'HR':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
      case 'FIN':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'TECH':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300';
    }
  };

  return (
    <aside
      className={`border-r select-none z-20 flex flex-col justify-between transition-all duration-300 relative ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isLight
          ? 'bg-white border-slate-200/80 text-slate-800'
          : 'bg-[#0a0f1d] border-slate-800 text-slate-200 shadow-xl'
      }`}
    >
      {/* Collapse Toggle Button (< matching Image 1) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-5 w-6 h-6 rounded-full border shadow-sm flex items-center justify-center transition-transform z-30 ${
          isLight
            ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
        }`}
        title={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Brand Logo */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
          <Brain className="w-5 h-5" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white truncate">
              DocuMind Enterprise
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              Đại học KTQD (NEU)
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Main Workspaces (Solid Blue Pill for Active matching Image 1) */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0066cc] text-white shadow-md shadow-blue-600/25 font-bold'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Departments RBAC Filter */}
        {!isCollapsed && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 flex items-center justify-between">
              <span>PHÒNG BAN (RBAC)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                ACTIVE
              </span>
            </div>

            <button
              onClick={() => onSelectDept(null)}
              className={`w-full px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                selectedDeptId === null
                  ? isLight
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'bg-slate-800 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Tất cả phòng ban</span>
              </div>
              <span className="text-[10px] font-mono opacity-60">All</span>
            </button>

            {departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => onSelectDept(dept.id)}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? isLight
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'bg-slate-800 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{dept.name.split(' (')[0]}</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${getDeptBadge(dept.code)}`}>
                    {dept.code}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Section matching Reference Image 1 */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
            isLight
              ? 'text-slate-700 hover:bg-slate-100'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Cài đặt hệ thống"
        >
          <Settings className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {!isCollapsed && <span>Cài đặt</span>}
        </button>

        {/* User Card matching Image 1 (avatar with letter p in blue circle) */}
        <div
          className={`p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${
            isLight ? 'bg-slate-100/90' : 'bg-slate-800/80'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
            {user.full_name ? user.full_name[0].toLowerCase() : 'p'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.full_name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                {user.role === 'ADMIN' ? 'Quản trị viên' : user.department_code || 'Nhân viên'}
              </div>
            </div>
          )}
        </div>

        {/* Logout button in Red matching Image 1 */}
        <button
          onClick={onLogout}
          className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
