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
import { UIThemeId } from '../types';
import { THEMES } from '../theme/themes';

interface AdminDashboardProps {
  currentTheme: UIThemeId;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentTheme }) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const activeTheme = THEMES[currentTheme];

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
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Bảng Điều Khiển Quản Trị &amp; Audit Log
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi hiệu suất khai thác tri thức, tình trạng chỉ mục và nhật ký bảo mật hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Indexing Engine: 100% OPERATIONAL</span>
          </span>
        </div>
      </div>

      {/* Subtle & Tasteful Tet Holiday Operational Status */}
      <div className="flex items-center justify-between p-3.5 px-4.5 rounded-2xl bg-gradient-to-r from-red-600/10 via-amber-500/15 to-rose-600/10 border border-amber-300/60 dark:border-amber-700/50 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-lg">🌸</span>
          <div>
            <div className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <span>Trực Ban Khai Thác Tri Thức Dịp Tết Bính Ngọ 2026</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                Thông Suốt 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Hệ thống duy trì 100% thời gian hoạt động • Sẵn sàng hỗ trợ cán bộ và giảng viên tra cứu quy chế xuyên kỳ nghỉ lễ.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400">
          <span>🧧</span>
          <span>Xuân An Khang</span>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const bgGradients = [
            'from-indigo-50/50 via-white to-white hover:border-indigo-300 hover:shadow-indigo-500/10',
            'from-cyan-50/50 via-white to-white hover:border-cyan-300 hover:shadow-cyan-500/10',
            'from-emerald-50/50 via-white to-white hover:border-emerald-300 hover:shadow-emerald-500/10',
            'from-purple-50/50 via-white to-white hover:border-purple-300 hover:shadow-purple-500/10',
          ];
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${bgGradients[idx % 4]} border border-slate-200 rounded-xl p-5 space-y-3 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-2xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-lg ${kpi.bgGlow} ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.val}</div>
              <div className="text-[11px] font-mono text-emerald-600 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RBAC Policy Enforcer</span>
            </span>
            <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">Strict Mode</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Kiểm tra quyền truy cập ở cấp độ thư mục và tài liệu trước mọi truy vấn Hybrid Search.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Indirect Injection Defense</span>
            </span>
            <span className="text-indigo-700 font-mono text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-medium">Protected</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Cô lập context với delimiter XML &lt;untrusted_retrieved_context&gt; và Output Guardrail regex.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Temporal Validity Filter</span>
            </span>
            <span className="text-blue-700 font-mono text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-medium">Active</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Loại bỏ tài liệu đã hết hiệu lực (expired) hoặc đã bị thay thế (superseded) khỏi context.
          </p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Nhật Ký Hoạt Động &amp; Bảo Mật (Audit Log Trail)</span>
          </h3>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {['ALL', 'COPILOT_QUERY', 'UPLOAD_DOCUMENT', 'SEARCH_HYBRID'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterAction === act
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-4">Thời Gian</th>
                <th className="p-3.5">Người Dùng</th>
                <th className="p-3.5">Hành Động</th>
                <th className="p-3.5">Tài Nguyên</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 pr-4">Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-4 font-mono text-[11px] text-slate-500">{log.time}</td>
                  <td className="p-3.5 font-medium text-slate-900">{log.user}</td>
                  <td className="p-3.5 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">{log.resource}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {log.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Lock className="w-3 h-3 text-rose-600" />
                      )}
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-slate-500 text-[11px]">{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
