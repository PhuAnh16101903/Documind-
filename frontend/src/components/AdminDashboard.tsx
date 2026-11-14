import React from 'react';
import { Users, Building2, FileText, MessageSquare, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const kpis = [
    { label: 'Tổng Người Dùng', val: '48', change: '+12% tháng này', icon: Users, color: 'text-indigo-400' },
    { label: 'Phòng Ban Hoạt Động', val: '4', change: 'Đầy đủ cấu hình RBAC', icon: Building2, color: 'text-cyan-400' },
    { label: 'Tài Liệu Đã Lập Chỉ Mục', val: '124', change: '100% RAG Ready', icon: FileText, color: 'text-emerald-400' },
    { label: 'Truy Vấn AI Copilot', val: '1,420', change: 'Độ trễ TB 240ms', icon: MessageSquare, color: 'text-purple-400' },
  ];

  const auditLogs = [
    { id: 1, user: 'dev.an@documind.internal', action: 'COPILOT_QUERY', resource: 'TECH-API-DOCS', status: 'SUCCESS', time: '10:42:15' },
    { id: 2, user: 'hr.manager@documind.internal', action: 'UPLOAD_DOCUMENT', resource: 'Quy_Che_Luong_2026.docx', status: 'SUCCESS', time: '10:38:00' },
    { id: 3, user: 'dev.an@documind.internal', action: 'SEARCH_HYBRID', resource: 'Báo cáo tài chính', status: 'DENIED', time: '10:25:12', note: 'Chặn bởi RBAC (TC-SEC-01)' },
    { id: 4, user: 'admin@documind.internal', action: 'INDEXING_COMPLETE', resource: 'Architecture_Standards.pdf', status: 'SUCCESS', time: '09:14:00' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Bảng Điều Khiển Quản Trị &amp; Audit Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi hiệu suất khai thác tri thức, tình trạng chỉ mục và nhật ký bảo mật hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI Indexing Engine: 100% OPERATIONAL</span>
          </span>
        </div>
      </div>

      <!-- KPI Grid -->
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white">{kpi.val}</div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <!-- Audit Logs Table -->
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Nhật Ký Hoạt Động &amp; Bảo Mật (Audit Log Trail)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Bất biến • Ghi nhận theo thời gian thực</span>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-300 border-b border-slate-700/60">
              <tr>
                <th className="p-3 pl-4">Thời Gian</th>
                <th className="p-3">Người Dùng</th>
                <th className="p-3">Hành Động</th>
                <th className="p-3">Tài Nguyên</th>
                <th className="p-3 text-right pr-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 pl-4 text-slate-400">{log.time}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.user}</td>
                  <td className="p-3 text-indigo-400 font-semibold">{log.action}</td>
                  <td className="p-3 text-slate-300 truncate max-w-xs">{log.resource}</td>
                  <td className="p-3 text-right pr-4">
                    {log.status === 'SUCCESS' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                        SUCCESS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-bold">
                        ACCESS DENIED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
