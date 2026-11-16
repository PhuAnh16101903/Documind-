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

  return (
    <aside className="w-56 border-r border-slate-800 bg-slate-950 flex flex-col justify-between select-none z-20">
      <div className="p-3 space-y-5 overflow-y-auto">
        {/* Main Workspaces */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider">
            Không Gian
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Departments RBAC Scoped */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-2.5 mb-1.5 uppercase tracking-wider flex items-center justify-between">
            <span>Phòng Ban</span>
          </div>

          <button
            onClick={() => onSelectDept(null)}
            className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
              selectedDeptId === null
                ? 'bg-slate-900 text-white font-medium border border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Toàn Doanh Nghiệp</span>
            </span>
          </button>

          {departments.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => onSelectDept(dept.id)}
                className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium border border-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <span className="truncate text-left">{dept.name}</span>
                <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-900 text-slate-500">
                  {dept.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Quota */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>Dung lượng</span>
          </span>
          <span className="text-slate-300 font-mono text-[10px]">1.4 / 10 GB</span>
        </div>
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full w-[14%]" />
        </div>
      </div>
    </aside>
  );
};
