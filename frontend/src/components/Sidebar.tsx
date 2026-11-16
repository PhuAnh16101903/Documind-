import React from 'react';
import {
  FolderTree,
  MessageSquareText,
  BarChart3,
  Database,
  HardDrive,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Department, UIThemeId } from '../types';
import { THEMES } from '../theme/themes';

interface SidebarProps {
  departments: Department[];
  selectedDeptId: number | null;
  onSelectDept: (id: number | null) => void;
  activeTab: 'knowledge' | 'copilot' | 'analytics';
  onSelectTab: (tab: 'knowledge' | 'copilot' | 'analytics') => void;
  currentTheme: UIThemeId;
}

export const Sidebar: React.FC<SidebarProps> = ({
  departments,
  selectedDeptId,
  onSelectDept,
  activeTab,
  onSelectTab,
  currentTheme,
}) => {
  const activeTheme = THEMES[currentTheme];

  const navItems = [
    {
      id: 'knowledge' as const,
      label: 'Kho Tri Thức & Thư Mục',
      icon: FolderTree,
      color: 'text-indigo-400',
      badge: null,
    },
    {
      id: 'copilot' as const,
      label: 'AI Copilot & Đối Chiếu',
      icon: MessageSquareText,
      color: 'text-cyan-400',
      badge: 'RAG 2.0',
    },
    {
      id: 'analytics' as const,
      label: 'Quản Trị & Audit Log',
      icon: BarChart3,
      color: 'text-emerald-400',
      badge: null,
    },
  ];

  return (
    <aside className={`w-64 border-r ${activeTheme.borderClass} ${activeTheme.surfaceClass} flex flex-col justify-between select-none relative z-20 transition-colors duration-300`}>
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Main Workspaces */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-2 flex items-center justify-between">
            <span>KHÔNG GIAN LÀM VIỆC</span>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: activeTheme.accentColor }}
            />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all duration-200 group relative ${
                  isActive
                    ? `${activeTheme.activePillClass} font-semibold shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                    style={{ backgroundColor: activeTheme.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Departments RBAC Scoped */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building className="w-3 h-3 text-slate-400" />
              <span>PHÒNG BAN TRUY CẬP</span>
            </span>
            <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              RBAC ACTIVE
            </span>
          </div>

          <button
            onClick={() => onSelectDept(null)}
            className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-200 ${
              selectedDeptId === null
                ? 'bg-slate-800/90 text-white font-semibold border border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Toàn Bộ Doanh Nghiệp</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">ALL</span>
          </button>

          {departments.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => onSelectDept(dept.id)}
                className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? `${activeTheme.activePillClass} font-semibold shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <span className="truncate max-w-[130px] text-left">{dept.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-white/[0.06]">
                  {dept.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Quota & System Health Card */}
      <div className={`p-4 border-t ${activeTheme.borderClass} bg-black/20 space-y-3`}>
        <div className={`p-3 rounded-xl ${activeTheme.cardClass} space-y-2`}>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>KHO TRI THỨC</span>
            </span>
            <span className="text-emerald-400 font-bold">1.4 / 10 GB</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: '14%',
                backgroundColor: activeTheme.accentColor,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>TC-SEC-01 Validated</span>
            </span>
            <span className="text-slate-400">14% Sử dụng</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
