import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Clock,
  CheckCircle2,
  Eye,
  Grid,
  List,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter,
  GitCompare,
  Upload,
  ArrowRight,
  Shield,
  FileCheck,
} from 'lucide-react';
import { Document, UIThemeId } from '../types';
import { DocumentDiffModal } from './DocumentDiffModal';

interface KnowledgeExplorerProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onOpenUpload: () => void;
  onAskAI?: (doc: Document) => void;
  currentTheme?: UIThemeId;
  themeMode?: 'light' | 'dark';
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  onAskAI,
  themeMode = 'light',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const isLight = themeMode === 'light';

  const getCardTheme = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return {
          stripe: 'from-rose-500 via-pink-500 to-rose-400',
          bg: isLight ? 'bg-white hover:bg-slate-50/80' : 'bg-[#0f172a] hover:bg-[#131d36]',
          hoverBorder: 'hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/10',
          iconBox: isLight ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-rose-950/50 text-rose-400 border border-rose-800',
          versionBadge: isLight ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-rose-950/40 text-rose-300 border border-rose-800',
          titleHover: 'group-hover:text-rose-600',
        };
      case 'docx':
      case 'doc':
        return {
          stripe: 'from-blue-500 via-indigo-500 to-cyan-400',
          bg: isLight ? 'bg-white hover:bg-slate-50/80' : 'bg-[#0f172a] hover:bg-[#131d36]',
          hoverBorder: 'hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10',
          iconBox: isLight ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-blue-950/50 text-blue-400 border border-blue-800',
          versionBadge: isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950/40 text-blue-300 border border-blue-800',
          titleHover: 'group-hover:text-blue-600',
        };
      default:
        return {
          stripe: 'from-emerald-500 via-teal-500 to-green-400',
          bg: isLight ? 'bg-white hover:bg-slate-50/80' : 'bg-[#0f172a] hover:bg-[#131d36]',
          hoverBorder: 'hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10',
          iconBox: isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800',
          versionBadge: isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800',
          titleHover: 'group-hover:text-emerald-600',
        };
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchType =
      filterType === 'all' || doc.file_type.toLowerCase() === filterType.toLowerCase();
    const matchSearch =
      doc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchType && matchSearch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-y-auto font-sans transition-colors duration-200 ${
        isLight ? 'bg-[#f4f7fb] text-slate-800' : 'bg-[#060c18] text-slate-100'
      }`}
    >
      <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-6 pb-20">
        {/* ========================================================= */}
        {/* HERO SECTION MATCHING REFERENCE IMAGE 1 */}
        {/* ========================================================= */}
        <div className="relative flex items-center justify-between pb-2 pt-2">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Khởi đầu từ kho tri thức của bạn.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Khám phá quy chế hiện hành và chuẩn bị dữ liệu đối chiếu chính xác cho doanh nghiệp.
            </p>
          </div>

          {/* Isometric 3D Document Illustration matching Reference Image 1 */}
          <div className="hidden md:block relative w-36 h-28 flex-shrink-0 select-none">
            {/* Background 3D paper stack shadow */}
            <div className="absolute top-2 right-2 w-28 h-24 rounded-2xl bg-indigo-200/50 dark:bg-indigo-950/60 rotate-6 shadow-md" />
            <div className="absolute top-1 right-1 w-28 h-24 rounded-2xl bg-blue-100/80 dark:bg-slate-800 rotate-3 shadow-md border border-slate-200 dark:border-slate-700" />

            {/* Foreground 3D Document Card */}
            <div className="absolute top-0 right-0 w-28 h-24 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] text-slate-800 dark:text-white font-mono tracking-wider">
                  DOC
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-1.5 w-14 bg-indigo-200 dark:bg-indigo-900 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-0.5">
                  <div className="w-2 h-1 bg-slate-300 dark:bg-slate-600 rounded-xs" />
                  <div className="w-2 h-1 bg-slate-300 dark:bg-slate-600 rounded-xs" />
                </div>
                {/* Red Seal / Circle badge on bottom right matching Image 1 */}
                <div className="w-4 h-4 rounded-full bg-[#c51c16] shadow-sm flex items-center justify-center text-[8px] text-white font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROGRESS STEP INDICATOR PILLS MATCHING IMAGE 1 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Step 1: Active Pill */}
          <button
            onClick={() => setActiveStep(1)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
              activeStep === 1
                ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-600 shadow-md ring-1 ring-indigo-200 dark:ring-indigo-800'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                activeStep === 1
                  ? 'bg-[#0066cc] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              01
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                Khám phá quy chế
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Tải lên và tra cứu
              </div>
            </div>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => setActiveStep(2)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
              activeStep === 2
                ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-600 shadow-md ring-1 ring-indigo-200 dark:ring-indigo-800'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                activeStep === 2
                  ? 'bg-[#0066cc] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              02
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                So khớp điều khoản
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Đối chiếu với AI
              </div>
            </div>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => setActiveStep(3)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
              activeStep === 3
                ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-600 shadow-md ring-1 ring-indigo-200 dark:ring-indigo-800'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                activeStep === 3
                  ? 'bg-[#0066cc] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              03
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                Tự tin áp dụng
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Kiểm tra pháp lý
              </div>
            </div>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MAIN BENTO CARD WORKSPACE MATCHING IMAGE 1 */}
        {/* ========================================================= */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isLight
              ? 'bg-white border-slate-200/90'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          {/* Card Header matching Image 1: "Tải CV của bạn BƯỚC 01" */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Tài Liệu &amp; Quy Chế Doanh Nghiệp
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold border border-rose-200 dark:border-rose-800 uppercase">
                  BƯỚC 01
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Để dữ liệu và quy định kể câu chuyện vận hành minh bạch của doanh nghiệp.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsDiffOpen(true)}
                className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap flex-shrink-0"
                title="So sánh phiên bản v1.0 và v2.0"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                <span>So Sánh Phiên Bản</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="h-8 px-3.5 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nạp Tài Liệu</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone matching Reference Image 1 */}
          <div
            onClick={onOpenUpload}
            className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all group ${
              isLight
                ? 'border-slate-300 hover:border-[#0066cc] bg-[#f8fafc] hover:bg-blue-50/30'
                : 'border-slate-700 hover:border-blue-500 bg-slate-950/60 hover:bg-slate-900'
            }`}
          >
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0066cc] dark:text-blue-400 group-hover:scale-110 transition-transform mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-slate-800 dark:text-slate-100 text-center">
              Kéo thả tài liệu vào đây
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-center">
              hoặc <span className="text-[#0066cc] dark:text-blue-400 font-semibold underline underline-offset-2">chọn file từ thiết bị</span> (PDF, Word, Excel, Markdown)
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Lọc tài liệu trong danh sách..."
                className={`w-full h-9 pl-9 pr-3 rounded-xl border text-xs focus:outline-none transition-colors font-sans ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Type Filter Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                {['all', 'pdf', 'docx'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-mono transition-all ${
                      filterType === t
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* View mode (Grid / List) */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Chế độ lưới (Grid)"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Chế độ bảng (Table)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredDocs.map((doc) => {
              const theme = getCardTheme(doc.file_type);
              return (
                <div
                  key={doc.id}
                  className={`group rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between shadow-xs hover:shadow-md ${
                    theme.bg
                  } ${
                    isLight
                      ? 'border-slate-200/90 hover:border-blue-400'
                      : 'border-slate-800 hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Version pill + Status */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl flex items-center justify-center ${theme.iconBox}`}>
                        {doc.file_type === 'pdf' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <FileSpreadsheet className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${theme.versionBadge}`}>
                          v{doc.current_version}.0
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>ĐÃ CHỈ MỤC</span>
                        </span>
                      </div>
                    </div>

                    {/* Document Title & File Name */}
                    <div>
                      <h3
                        onClick={() => onSelectDocument(doc)}
                        className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono truncate mt-1">
                        {doc.file_name}
                      </p>
                    </div>

                    {/* Metadata: Date & File size */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(doc.created_at).toLocaleDateString('vi-VN')}</span>
                      </span>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectDocument(doc)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem</span>
                    </button>

                    {onAskAI && (
                      <button
                        onClick={() => onAskAI(doc)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>Hỏi AI</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Version Diff Modal */}
      <DocumentDiffModal isOpen={isDiffOpen} onClose={() => setIsDiffOpen(false)} />
    </div>
  );
};
