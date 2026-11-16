import React from 'react';
import {
  FolderTree,
  MessageSquareText,
  BarChart3,
  Database,
  Building,
  HardDrive,
} from 'lucide-react';
import { Department, UIThemeId } from '../types';

interface SidebarProps {
  departments: Department[];
  selectedDeptId: number | null;
  onSelectDept: (id: number | null) => void;
  activeTab: 'knowledge' | 'copilot' | 'analytics';
  onSelectTab: (tab: 'knowledge' | 'copilot' | 'analytics') => void;
  currentTheme?: UIThemeId;
}

export const Sidebar: React.FC<SidebarProps> = ({
  departments,
  selectedDeptId,
  onSelectDept,
  activeTab,
  onSelectTab,
}) => {
  const navItems = [
    {
      id: 'knowledge' as const,
      label: 'Kho Tri Thức',
      icon: FolderTree,
    },
    {
      id: 'copilot' as const,
      label: 'AI Copilot',
      icon: MessageSquareText,
    },
    {
      id: 'analytics' as const,
      label: 'Nhật Ký & Quản Trị',
      icon: BarChart3,
    },
  ];

  const getDeptBadge = (code: string) => {
    switch (code) {
      case 'HR':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'FIN':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'TECH':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <aside className="w-60 border-r border-slate-800 bg-[#0a0f1d] flex flex-col justify-between select-none z-20 text-slate-300 shadow-lg">
      <div className="p-3.5 space-y-6 overflow-y-auto">
        {/* Main Workspaces */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-2 flex items-center justify-between">
            <span>KHÔNG GIAN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            let iconColor = 'text-indigo-400';
            if (item.id === 'copilot') iconColor = 'text-purple-400';
            if (item.id === 'analytics') iconColor = 'text-emerald-400';

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : iconColor}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Departments RBAC Scoped */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-2 flex items-center justify-between">
            <span>PHÒNG BAN (RBAC)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              ACTIVE
            </span>
          </div>

          <button
            onClick={() => onSelectDept(null)}
            className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all duration-200 hover:translate-x-1 ${
              selectedDeptId === null
                ? 'bg-slate-800/90 text-white font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Toàn Doanh Nghiệp</span>
            </span>
          </button>

          {departments.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            const badgeClass = getDeptBadge(dept.code);
            return (
              <button
                key={dept.id}
                onClick={() => onSelectDept(dept.id)}
                className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all duration-200 hover:translate-x-1 ${
                  isSelected
                    ? 'bg-slate-800/90 text-white font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="truncate text-left">{dept.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold shadow-2xs ${badgeClass}`}>
                  {dept.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Quota */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dung lượng</span>
          </span>
          <span className="text-slate-200 font-mono text-[11px] font-semibold">1.4 / 10 GB</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-[14%]" />
        </div>
      </div>
    </aside>
  );
};
