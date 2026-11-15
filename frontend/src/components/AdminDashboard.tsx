import React, { useState } from 'react';
import {
  Users,
  Building2,
  FileText,
  MessageSquare,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Zap,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const kpis = [
    {
      label: 'Tổng Người Dùng',
      val: '48',
      change: '+12% tháng này',
      icon: Users,
      color: 'text-indigo-400',
      bgGlow: 'bg-indigo-500/10',
    },
    {
      label: 'Phòng Ban Hoạt Động',
      val: '4',
      change: 'Đầy đủ cấu hình RBAC',
      icon: Building2,
      color: 'text-cyan-400',
      bgGlow: 'bg-cyan-500/10',
    },
    {
      label: 'Tài Liệu Đã Lập Chỉ Mục',
      val: '124',
      change: '100% RAG Ready',
      icon: FileText,
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10',
    },
    {
      label: 'Truy Vấn AI Copilot',
      val: '1,420',
      change: 'Độ trễ TB 240ms',
      icon: MessageSquare,
      color: 'text-purple-400',
      bgGlow: 'bg-purple-500/10',
    },
  ];

  const auditLogs = [
    {
      id: 1,
      user: 'dev.an@documind.internal',
      action: 'COPILOT_QUERY',
      resource: 'TECH-API-DOCS',
      status: 'SUCCESS',
      time: '10:42:15',
      note: 'Truy xuất thành công kèm 2 trích dẫn',
    },
    {
      id: 2,
      user: 'hr.manager@documind.internal',
      action: 'UPLOAD_DOCUMENT',
      resource: 'Quy_Che_Luong_2026.docx',
      status: 'SUCCESS',
      time: '10:38:00',
      note: 'Đã hoàn thành Ingestion & Embedding',
    },
    {
      id: 3,
      user: 'dev.an@documind.internal',
      action: 'SEARCH_HYBRID',
      resource: 'Báo cáo tài chính Q4.xlsx',
      status: 'DENIED',
      time: '10:25:12',
      note: 'Chặn bởi RBAC Isolation (TC-SEC-01)',
    },
    {
      id: 4,
      user: 'admin@documind.internal',
      action: 'INDEXING_COMPLETE',
      resource: 'Architecture_Standards.pdf',
      status: 'SUCCESS',
      time: '09:14:00',
      note: '18 Chunks • Gemini Embeddings',
    },
  ];

  const filteredLogs =
    filterAction === 'ALL' ? auditLogs : auditLogs.filter((log) => log.action === filterAction);

  return (
    <div className="flex-1 overflow-y-auto p-7 space-y-6 bg-[#080c16]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Bảng Điều Khiển Quản Trị &amp; Audit Log
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Theo dõi hiệu suất khai thác tri thức, tình trạng chỉ mục và nhật ký bảo mật hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>AI Indexing Engine: 100% OPERATIONAL</span>
          </span>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-xl ${kpi.bgGlow} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">{kpi.val}</div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>RBAC Policy Enforcer</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Strict Mode</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Kiểm tra quyền truy cập ở cấp độ thư mục và tài liệu trước mọi truy vấn Hybrid Search.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Indirect Injection Defense</span>
            </span>
            <span className="text-cyan-400 font-mono text-[10px]">Protected</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Cô lập context với delimiter XML &lt;untrusted_retrieved_context&gt; và Output Guardrail regex.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Temporal Validity Filter</span>
            </span>
            <span className="text-purple-400 font-mono text-[10px]">Active</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Loại bỏ tài liệu đã hết hiệu lực (expired) hoặc đã bị thay thế (superseded) khỏi context.
          </p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Nhật Ký Hoạt Động &amp; Bảo Mật (Audit Log Trail)</span>
          </h3>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {['ALL', 'COPILOT_QUERY', 'UPLOAD_DOCUMENT', 'SEARCH_HYBRID'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterAction === act
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-300 border-b border-white/[0.06]">
              <tr>
                <th className="p-4 pl-5">Thời Gian</th>
                <th className="p-4">Người Dùng</th>
                <th className="p-4">Hành Động</th>
                <th className="p-4">Tài Nguyên</th>
                <th className="p-4">Ghi Chú</th>
                <th className="p-4 text-right pr-5">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300 text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 pl-5 text-slate-400">{log.time}</td>
                  <td className="p-4 font-semibold text-slate-200">{log.user}</td>
                  <td className="p-4 text-indigo-300 font-semibold">{log.action}</td>
                  <td className="p-4 text-slate-300 truncate max-w-xs">{log.resource}</td>
                  <td className="p-4 text-slate-400 font-sans text-xs">{log.note}</td>
                  <td className="p-4 text-right pr-5">
                    {log.status === 'SUCCESS' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold">
                        SUCCESS
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-bold">
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
