import React from 'react';
import { FolderTree, MessageSquareText, ShieldAlert, BarChart3, Database, HardDrive, Users } from 'lucide-react';
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
  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0c111d] flex flex-col justify-between select-none">
      <div className="p-4 space-y-6">
        <!-- Main Workspaces -->
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-2">
            KHÔNG GIAN LÀM VIỆC
          </div>

          <button
            onClick={() => onSelectTab('knowledge')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'knowledge'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderTree className="w-4 h-4 text-indigo-400" />
            <span>Kho Tri Thức &amp; Thư Mục</span>
          </button>

          <button
            onClick={() => onSelectTab('copilot')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'copilot'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquareText className="w-4 h-4 text-cyan-400" />
            <span>Hỏi Đáp AI Copilot</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Dashboard &amp; Audit Log</span>
          </button>
        </div>

        <!-- Departments List -->
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-2 flex items-center justify-between">
            <span>PHÒNG BAN TRUY CẬP</span>
            <span className="text-cyan-400 font-mono text-[9px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
              RBAC ACTIVE
            </span>
          </div>

          <button
            onClick={() => onSelectDept(null)}
            className={`w-full px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
              selectedDeptId === null
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Toàn Bộ Doanh Nghiệp</span>
            </span>
          </button>

          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => onSelectDept(dept.id)}
              className={`w-full px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                selectedDeptId === dept.id
                  ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span className="truncate w-40 text-left">{dept.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{dept.code}</span>
            </button>
          ))}
        </div>
      </div>

      <!-- Storage Quota Status -->
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>DUNG LƯỢNG KHO</span>
          </span>
          <span className="text-emerald-400 font-bold">1.4 GB / 10 GB</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: '14%' }}></div>
        </div>
      </div>
    </aside>
  );
};
