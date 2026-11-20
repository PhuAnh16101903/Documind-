import React, { useState, useMemo } from 'react';
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
  TrendingUp,
  Download,
  Database,
  Cpu,
  Clock,
  Sparkles,
  ArrowUpRight,
  HardDrive,
  BarChart2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { UIThemeId } from '../types';
import { Language, translations } from '../services/i18n';

interface AdminDashboardProps {
  currentTheme?: UIThemeId;
  themeMode?: 'light' | 'dark';
  lang?: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  themeMode = 'light',
  lang = 'vi',
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchLogQuery, setSearchLogQuery] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const isLight = themeMode === 'light';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Thời Gian,Người Dùng,Hành Động,Tài Nguyên,Trạng Thái,Ghi Chú\n';
    const rows = auditLogs.map(
      (l) => `"${l.time}","${l.user}","${l.action}","${l.resource}","${l.status}","${l.note}"`
    ).join('\n');
    const blob = new Blob([csvHeader + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocuMind_Audit_Log_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      label: lang === 'vi' ? 'Tổng Tài Liệu Đã Chỉ Mục' : 'Total Indexed Documents',
      val: '124',
      subtext: lang === 'vi' ? '100% RAG Grounded' : '100% RAG Grounded',
      trend: '+8 tệp tuần này',
      icon: FileText,
      gradient: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      label: lang === 'vi' ? 'Truy Vấn AI Copilot' : 'AI Copilot Queries',
      val: '1,420',
      subtext: lang === 'vi' ? 'Độ trễ trung bình 210ms' : 'Avg latency 210ms',
      trend: '+18.4% so với tuần trước',
      icon: MessageSquare,
      gradient: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    {
      label: lang === 'vi' ? 'Người Dùng & Phân Quyền' : 'Active Users & Roles',
      val: '48',
      subtext: lang === 'vi' ? '4 phòng ban doanh nghiệp' : '4 enterprise depts',
      trend: 'Zero-Trust RBAC Enforced',
      icon: Users,
      gradient: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      label: lang === 'vi' ? 'Bảo Mật & Tuân Thủ' : 'Security Clearance',
      val: '100%',
      subtext: lang === 'vi' ? '0 sự cố rò rỉ dữ liệu' : '0 data leakage incidents',
      trend: 'Audit Trail Realtime Active',
      icon: ShieldCheck,
      gradient: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
  ];

  const hourlyActivity = [
    { hour: '08:00', queries: 42, height: '40%' },
    { hour: '09:00', queries: 95, height: '85%' },
    { hour: '10:00', queries: 118, height: '100%' },
    { hour: '11:00', queries: 82, height: '72%' },
    { hour: '12:00', queries: 28, height: '25%' },
    { hour: '13:00', queries: 54, height: '48%' },
    { hour: '14:00', queries: 104, height: '90%' },
    { hour: '15:00', queries: 110, height: '94%' },
    { hour: '16:00', queries: 76, height: '65%' },
    { hour: '17:00', queries: 38, height: '32%' },
  ];

  const departmentStorage = [
    {
      name: 'Phòng Kỹ Thuật & R&D',
      code: 'TECH',
      used: 6.8,
      total: 10.0,
      percent: 68,
      color: 'bg-sky-500',
      docs: 42,
    },
    {
      name: 'Kho Tri Thức Chung',
      code: 'GEN',
      used: 3.4,
      total: 10.0,
      percent: 34,
      color: 'bg-purple-500',
      docs: 38,
    },
    {
      name: 'Phòng Tài Chính Kế Toán',
      code: 'FIN',
      used: 2.8,
      total: 5.0,
      percent: 56,
      color: 'bg-emerald-500',
      docs: 24,
    },
    {
      name: 'Phòng Nhân Sự',
      code: 'HR',
      used: 2.1,
      total: 5.0,
      percent: 42,
      color: 'bg-rose-500',
      docs: 20,
    },
  ];

  const auditLogs = [
    {
      id: 1,
      user: 'Trần Quốc Bảo (TECH)',
      email: 'tech.lead@documind.internal',
      action: 'COPILOT_QUERY',
      resource: 'BaoCaoXayDungWebsiteTMDT-1.docx',
      status: 'SUCCESS',
      time: '18:15:20',
      note: 'Tra cứu kiến trúc MVC & RESTful API kèm 2 trích dẫn',
    },
    {
      id: 2,
      user: 'Lê Thiên Phú (ADMIN)',
      email: 'admin@documind.internal',
      action: 'UPLOAD_DOCUMENT',
      resource: 'TieuLuan_MarianMT_DeTai51.docx',
      status: 'SUCCESS',
      time: '17:42:10',
      note: 'Phân tích tự động 24 trang, 6 tab giao diện & 12 chunks',
    },
    {
      id: 3,
      user: 'Nguyễn Minh Anh (HR)',
      email: 'hr.specialist@documind.internal',
      action: 'SEARCH_HYBRID',
      resource: 'Báo cáo tài chính Q4.xlsx',
      status: 'DENIED',
      time: '16:20:05',
      note: 'RBAC Zero-Trust: Từ chối truy cập ngoài phân quyền phòng ban',
    },
    {
      id: 4,
      user: 'Đỗ Thanh Thảo (FIN)',
      email: 'fin.accountant@documind.internal',
      action: 'COPILOT_QUERY',
      resource: 'Quy_Dinh_Cong_Tac_Phi_FIN_v2.docx',
      status: 'SUCCESS',
      time: '15:10:30',
      note: 'Đối chiếu hạn mức lưu trú 1.200.000 VNĐ/ngày tại Hà Nội',
    },
    {
      id: 5,
      user: 'Trần Quốc Bảo (TECH)',
      email: 'tech.lead@documind.internal',
      action: 'INDEXING_COMPLETE',
      resource: 'Architecture_Security_Standards.pdf',
      status: 'SUCCESS',
      time: '14:05:12',
      note: 'Lập chỉ mục Hybrid BM25 & Gemini Embedding thành công',
    },
  ];

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchAction = filterAction === 'ALL' || log.action === filterAction;
      const matchSearch =
        !searchLogQuery.trim() ||
        log.user.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
        log.note.toLowerCase().includes(searchLogQuery.toLowerCase());
      return matchAction && matchSearch;
    });
  }, [filterAction, searchLogQuery]);

  return (
    <div className={`flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 font-sans transition-colors duration-200 ${
      isLight ? 'bg-slate-50/70 text-slate-800' : 'bg-[#060913] text-slate-200'
    }`}>
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{lang === 'vi' ? 'Bảng Điều Khiển Quản Trị & Khai Thác Tri Thức' : 'Executive Knowledge & Security Dashboard'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE</span>
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'vi'
                  ? 'Giám sát toàn diện hiệu suất RAG, phân bổ hạn mức bộ nhớ và nhật ký kiểm toán an ninh bảo mật'
                  : 'Real-time overview of RAG retrieval performance, department quotas, and RBAC audit trail'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Time Filter Pill */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
            isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                timeRange === 'today'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                timeRange === '7days'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                timeRange === '30days'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              30 ngày
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Luxury Tet Festive Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-600/10 via-amber-500/15 to-rose-600/10 border border-amber-300/80 dark:border-amber-700/60 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-lg shadow-md shadow-red-500/20 flex-shrink-0">
            🌸
          </div>
          <div>
            <div className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <span>Hệ Thống Trực Ban Khai Thác Tri Thức — Xuân Bính Ngọ 2026</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 font-bold">
                24/7 Sẵn Sàng
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              Toàn bộ cơ sở dữ liệu quy chế &amp; đề tài đã được lập chỉ mục vector • Sẵn sàng phục vụ tra cứu tức thời cho sinh viên, giảng viên và cán bộ NEU.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-700 dark:text-red-400 self-end sm:self-auto">
          <span>🧧 Vạn Sự Như Ý</span>
          <span>•</span>
          <span className="text-amber-600 dark:text-amber-400">NEU 2026</span>
        </div>
      </div>

      {/* Bento Grid Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden ${
                isLight
                  ? 'bg-white border-slate-200/80 shadow-xs hover:shadow-lg hover:border-blue-300'
                  : 'bg-slate-900/90 border-slate-800 shadow-lg hover:border-slate-700'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  {kpi.label}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${kpi.gradient} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Number Value */}
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                {kpi.val}
              </div>

              {/* Subtext and Trend */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-medium">
                <span className="text-slate-500 dark:text-slate-400">{kpi.subtext}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 flex-shrink-0">
                  <TrendingUp className="w-3 h-3" />
                  <span>{kpi.trend}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Visual Charts & Department Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: AI Copilot Hourly Activity */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-900/90 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Tần Suất Truy Vấn AI Copilot Theo Khung Giờ (Hôm Nay)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đỉnh điểm tra cứu tập trung từ 09:30 - 11:30 và 14:00 - 15:30
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200">
              Độ trễ TB: 210ms
            </span>
          </div>

          {/* Activity Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {hourlyActivity.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {bar.queries}
                </div>
                <div
                  style={{ height: bar.height }}
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300 shadow-xs"
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1">{bar.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quota breakdown per department */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200/80 shadow-xs' : 'bg-slate-900/90 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                <span>Hạn Mức &amp; Quota Bộ Nhớ</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dung lượng đã dùng theo từng phòng ban
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {departmentStorage.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 dark:text-slate-200">{dept.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {dept.code}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {dept.used} GB / {dept.total} GB ({dept.percent}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${dept.percent}%` }}
                    className={`h-full rounded-full ${dept.color} transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Tổng dung lượng kho: 30 GB</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Còn trống: 14.9 GB</span>
          </div>
        </div>
      </div>

      {/* Security Defenses Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4.5 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RBAC Policy Enforcer</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
              Strict Mode Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Kiểm tra quyền truy cập ở cấp độ thư mục và tài liệu trước mọi truy vấn Hybrid Search. Ngăn chặn triệt để rò rỉ dữ liệu chéo bộ phận.
          </p>
        </div>

        <div className={`p-4.5 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Indirect Injection Defense</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-300 font-bold">
              Protected 100%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Cô lập context với delimiter XML &lt;untrusted_retrieved_context&gt; và Output Guardrail regex. Loại bỏ hoàn toàn mã độc gián tiếp.
          </p>
        </div>

        <div className={`p-4.5 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Temporal Validity Filter</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-300 font-bold">
              Temporal Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tự động loại bỏ các văn bản đã hết hiệu lực hoặc bị thay thế khỏi ngữ cảnh truy xuất RAG để đảm bảo tính pháp lý cao nhất.
          </p>
        </div>
      </div>

      {/* Audit Logs Table Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Nhật Ký Hoạt Động &amp; An Ninh Kiểm Toán (Realtime Audit Trail)
              </h3>
              <p className="text-[11px] text-slate-500">
                Hiển thị {filteredLogs.length} sự kiện kiểm toán gần nhất
              </p>
            </div>
          </div>

          {/* Action Filter & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input in Audit Logs */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhật ký..."
                value={searchLogQuery}
                onChange={(e) => setSearchLogQuery(e.target.value)}
                className={`h-8 pl-8 pr-3 rounded-xl border text-xs outline-none transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                    : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Filter Pills */}
            <div className={`p-0.5 rounded-xl border flex items-center gap-1 text-xs font-mono ${
              isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
            }`}>
              {['ALL', 'COPILOT_QUERY', 'UPLOAD_DOCUMENT', 'SEARCH_HYBRID'].map((act) => (
                <button
                  key={act}
                  onClick={() => setFilterAction(act)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                    filterAction === act
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className={`border rounded-2xl overflow-hidden shadow-2xs ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <table className="w-full text-left text-xs">
            <thead className={`text-[11px] font-mono uppercase tracking-wider border-b ${
              isLight
                ? 'bg-slate-50 text-slate-600 border-slate-200'
                : 'bg-slate-850 text-slate-400 border-slate-800'
            }`}>
              <tr>
                <th className="p-3.5 pl-5">Thời Gian</th>
                <th className="p-3.5">Người Dùng</th>
                <th className="p-3.5">Hành Động</th>
                <th className="p-3.5">Tài Nguyên</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 pr-5">Ghi Chú &amp; Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="p-3.5 pl-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{log.time}</span>
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div>
                      <div>{log.user}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.email}</div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[200px]">
                    {log.resource}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
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
                  <td className="p-3.5 pr-5 text-slate-600 dark:text-slate-400 text-[11px]">{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};