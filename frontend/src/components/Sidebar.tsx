import React from 'react';
import {
  FolderTree,
  MessageSquareText,
  BarChart3,
  Database,
  HardDrive,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react';
import { Department } from '../types';

interface SidebarProps {
  departments: Department[];
  selectedDeptId: number | null;
  onSelectDept: (id: number | null) => void;
  activeTab: 'knowledge' | 'copilot' | 'analytics';
  onSelectTab: (tab: 'knowledge' | 'copilot' | 'analytics') => void;
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
    <aside className="w-64 border-r border-white/[0.08] bg-[#090e1a]/95 flex flex-col justify-between select-none relative z-20">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Main Workspaces */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 mb-2 flex items-center justify-between">
            <span>KHÔNG GIAN LÀM VIỆC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
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
                    ? 'bg-gradient-to-r from-indigo-500/15 to-indigo-500/5 text-white font-semibold border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? 'bg-indigo-600/30 text-indigo-300' : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-r-full" />
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
              <Database className="w-3.5 h-3.5 text-indigo-400" />
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
                    ? 'bg-indigo-950/40 text-indigo-200 border border-indigo-500/40 font-semibold shadow-sm'
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
      <div className="p-4 border-t border-white/[0.08] bg-[#070b14]/70 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>KHO TRI THỨC</span>
            </span>
            <span className="text-emerald-400 font-bold">1.4 / 10 GB</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: '14%' }}
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
