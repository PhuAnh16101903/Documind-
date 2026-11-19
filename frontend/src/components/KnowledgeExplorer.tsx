import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Eye,
  Grid,
  List,
  Calendar,
  Sparkles,
  Search,
  GitCompare,
  Upload,
  X,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { Document, UIThemeId } from '../types';
import { DocumentDiffModal } from './DocumentDiffModal';
import { TetFloralBorders } from './TetFloralBorders';
import { Language, translations } from '../services/i18n';

// Chuẩn hóa tiếng Việt bỏ dấu giúp tìm kiếm không dấu mượt mà
const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const ALPHABET = [
  'ALL', 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'
];

interface KnowledgeExplorerProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onOpenUpload: () => void;
  onAskAI?: (doc: Document) => void;
  currentTheme?: UIThemeId;
  themeMode?: 'light' | 'dark';
  lang?: Language;
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  onAskAI,
  themeMode = 'light',
  lang = 'vi',
}) => {
  const t = translations[lang];
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'name-asc' | 'name-desc' | 'size-desc'>('name-asc');
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showHolidayBanner, setShowHolidayBanner] = useState(true);

  const isLight = themeMode === 'light';

  // Tập hợp các chữ cái đầu thực tế có tài liệu trong kho
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    documents.forEach((d) => {
      const clean = removeVietnameseTones(d.title.trim());
      if (clean.length > 0) {
        letters.add(clean[0].toUpperCase());
      }
    });
    return letters;
  }, [documents]);

  const getCardTheme = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return {
          bg: isLight ? 'bg-white hover:bg-slate-50/80' : 'bg-[#0f172a] hover:bg-[#131d36]',
          iconBox: isLight ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-rose-950/50 text-rose-400 border border-rose-800',
          versionBadge: isLight ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-rose-950/40 text-rose-300 border border-rose-800',
        };
      case 'docx':
      case 'doc':
        return {
          bg: isLight ? 'bg-white hover:bg-slate-50/80' : 'bg-[#0f172a] hover:bg-[#131d36]',
          iconBox: isLight ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-blue-950/50 text-blue-400 border border-blue-800',
          versionBadge: isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950/40 text-blue-300 border border-blue-800',
        };
      default:
        return {
          bg: isLight ? 'bg-white hover:bg-slate-50/80' : 'bg-[#0f172a] hover:bg-[#131d36]',
          iconBox: isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800',
          versionBadge: isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800',
        };
    }
  };

  // Lọc tài liệu theo: Định dạng + Từ khóa (có/không dấu) + Chữ cái đầu (A-Z) + Sắp xếp
  const filteredDocs = useMemo(() => {
    return documents
      .filter((doc) => {
        // 1. Lọc theo định dạng file (ALL, PDF, DOCX...)
        const matchType =
          filterType === 'all' || doc.file_type.toLowerCase() === filterType.toLowerCase();

        // 2. Lọc theo ô tìm kiếm tên (hỗ trợ cả tiếng Việt có dấu và không dấu)
        const q = searchFilter.trim().toLowerCase();
        const qNorm = removeVietnameseTones(q);
        const titleNorm = removeVietnameseTones(doc.title);
        const fileNorm = removeVietnameseTones(doc.file_name);

        const matchSearch =
          !q ||
          doc.title.toLowerCase().includes(q) ||
          doc.file_name.toLowerCase().includes(q) ||
          titleNorm.includes(qNorm) ||
          fileNorm.includes(qNorm);

        // 3. Lọc theo chữ cái đầu A-Z
        const cleanTitle = removeVietnameseTones(doc.title.trim());
        const firstLetter = cleanTitle.length > 0 ? cleanTitle[0].toUpperCase() : '';
        const matchLetter = selectedLetter === 'ALL' || firstLetter === selectedLetter;

        return matchType && matchSearch && matchLetter;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.title.localeCompare(b.title, 'vi');
        }
        if (sortBy === 'name-desc') {
          return b.title.localeCompare(a.title, 'vi');
        }
        if (sortBy === 'size-desc') {
          return (b.file_size_bytes || 0) - (a.file_size_bytes || 0);
        }
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [documents, filterType, searchFilter, selectedLetter, sortBy]);

  const handleResetFilters = () => {
    setSearchFilter('');
    setSelectedLetter('ALL');
    setFilterType('all');
    setSortBy('name-asc');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-y-auto font-sans transition-colors duration-200 relative ${
        isLight ? 'bg-[#f4f7fb] text-slate-800' : 'bg-[#060c18] text-slate-100'
      }`}
    >
      {/* Subtle interior floral spring accents */}
      <TetFloralBorders showCouplets={false} className="opacity-25" />
      <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-6 pb-20">
        {/* Festive Internal New Year Greeting Banner */}
        {showHolidayBanner && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600/10 via-amber-500/15 to-rose-600/10 border border-amber-300/60 dark:border-amber-700/50 p-3 sm:px-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <span className="text-sm">🌸</span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <span>{lang === 'vi' ? 'Xuân Bính Ngọ 2026 • Chúc Mừng Năm Mới' : 'Happy Lunar New Year 2026'}</span>
                  <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 font-bold">
                    {lang === 'vi' ? 'Vạn Sự Như Ý' : 'Prosperity'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  {lang === 'vi'
                    ? 'DocuMind Enterprise kính chúc Quý Thầy Cô & Cán bộ năm mới An Khang Thịnh Vượng, Công Tác Hanh Thông!'
                    : 'DocuMind Enterprise wishes all faculty and staff a prosperous and healthy Lunar New Year!'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHolidayBanner(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              title="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* HERO SECTION MATCHING REFERENCE IMAGE 1 */}
        {/* ========================================================= */}
        <div className="relative flex items-center justify-between pb-2 pt-2">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.heroTitle}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Isometric 3D Document Illustration matching Reference Image 1 */}
          <div className="hidden md:block relative w-36 h-28 flex-shrink-0 select-none">
            <div className="absolute top-2 right-2 w-28 h-24 rounded-2xl bg-indigo-200/50 dark:bg-indigo-950/60 rotate-6 shadow-md" />
            <div className="absolute top-1 right-1 w-28 h-24 rounded-2xl bg-blue-100/80 dark:bg-slate-800 rotate-3 shadow-md border border-slate-200 dark:border-slate-700" />

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
          {/* Step 1 */}
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
                {t.step1Title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {t.step1Desc}
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
                {t.step2Title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {t.step2Desc}
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
                {t.step3Title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {t.step3Desc}
              </div>
            </div>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2-COLUMN BENTO WORKBENCH MATCHING REFERENCE IMAGE 1 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Panel: Upload Zone */}
          <section className={`p-6 sm:p-7 rounded-3xl border shadow-sm flex flex-col justify-between transition-all ${
            isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t.bentoTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t.bentoSubtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold border border-rose-200 dark:border-rose-800 uppercase flex-shrink-0">
                  {t.stepBadge}
                </span>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onClick={onOpenUpload}
                className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                  isLight
                    ? 'border-slate-300 hover:border-[#1461a4] bg-[#f8fafc] hover:bg-blue-50/30'
                    : 'border-slate-700 hover:border-blue-500 bg-slate-950/60 hover:bg-slate-900'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#1461a4] dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100 text-center">
                  {t.dropzoneTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                  {t.dropzoneSubtitle} · <span className="text-slate-400">{t.dropzoneFormats}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 mt-4">
              <button
                onClick={() => setIsDiffOpen(true)}
                className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.compareVersions}</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="h-9 px-4 rounded-xl bg-[#1461a4] hover:bg-[#0f4b80] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Nạp & Phân tích Quy chế' : 'Ingest & Analyze'}</span>
              </button>
            </div>
          </section>

          {/* Right Panel: Analysis Results matching Image 1 */}
          <section className={`p-6 sm:p-7 rounded-3xl border shadow-sm flex flex-col justify-between transition-all ${
            isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'vi' ? 'Kết quả phân tích & Đối chiếu' : 'Analysis & Verification Results'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                  {documents.length} {lang === 'vi' ? 'Tài liệu' : 'Documents'}
                </span>
              </div>

              {/* Empty state / Highlights matching Image 1 */}
              <div className="py-10 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#1461a4] dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                  {lang === 'vi' ? 'Hồ sơ và điều khoản sẽ xuất hiện ở đây' : 'Your provisions will appear here'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  {lang === 'vi'
                    ? 'Tải tài liệu lên hoặc chọn từ kho lưu trữ bên dưới để trích xuất điều khoản và kiểm chứng Zero-Trust.'
                    : 'Upload a document or select one below to extract provisions and verify via Zero-Trust.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero-Trust RBAC Secured</span>
              </span>
              <button
                onClick={() => {
                  if (documents[0]) onSelectDocument(documents[0]);
                }}
                className="text-xs font-semibold text-[#1461a4] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>{lang === 'vi' ? 'Xem tài liệu mẫu mới nhất →' : 'View latest sample →'}</span>
              </button>
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* DOCUMENT REPOSITORY SECTION */}
        {/* ========================================================= */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
          }`}
        >

          {/* Filters & Search Toolbar */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search input by Name */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={lang === 'vi' ? 'Tìm theo tên văn bản, mã số (gõ có hoặc không dấu)...' : 'Search by title, filename, code...'}
                  className={`w-full h-9 pl-9 pr-8 rounded-xl border text-xs focus:outline-none transition-colors font-sans ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-red-500'
                      : 'bg-slate-950 border-slate-800 text-slate-100 focus:border-amber-500'
                  }`}
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Sort Dropdown: A-Z, Z-A, Date, Size */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-9 px-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-red-500 font-sans cursor-pointer"
                  >
                    <option value="name-asc">Tên: A → Z</option>
                    <option value="name-desc">Tên: Z → A</option>
                    <option value="date-desc">Mới cập nhật</option>
                    <option value="size-desc">Dung lượng lớn</option>
                  </select>
                </div>

                {/* Type Filter Buttons */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                  {['all', 'pdf', 'docx'].map((tt) => (
                    <button
                      key={tt}
                      onClick={() => setFilterType(tt)}
                      className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-mono transition-all cursor-pointer ${
                        filterType === tt
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tt === 'all' ? t.filterAll : tt}
                    </button>
                  ))}
                </div>

                {/* View mode */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Table"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alphabetical Quick Filter Ribbon (Lọc nhanh theo chữ cái đầu A-Z) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 scrollbar-none text-[11px] font-mono border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-sans font-bold mr-1 flex items-center gap-1 flex-shrink-0">
                <span>Lọc chữ cái A-Z:</span>
              </span>
              {ALPHABET.map((letter) => {
                const isSelected = selectedLetter === letter;
                const hasDocs = letter === 'ALL' || availableLetters.has(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    disabled={!hasDocs}
                    className={`h-6 min-w-[24px] px-1.5 rounded-md flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-xs scale-105'
                        : hasDocs
                        ? isLight
                          ? 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-red-700 font-semibold border border-slate-200'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 font-semibold border border-slate-700'
                        : 'opacity-30 text-slate-400 cursor-not-allowed border border-transparent'
                    }`}
                    title={
                      letter === 'ALL'
                        ? 'Tất cả chữ cái'
                        : hasDocs
                        ? `Lọc tài liệu bắt đầu bằng chữ ${letter}`
                        : `Không có tài liệu bắt đầu bằng chữ ${letter}`
                    }
                  >
                    {letter === 'ALL' ? (lang === 'vi' ? 'TẤT CẢ' : 'ALL') : letter}
                  </button>
                );
              })}

              {/* Status counter & Reset button */}
              <div className="ml-auto pl-3 flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-slate-500 font-sans font-medium">
                  {lang === 'vi' ? `Hiển thị ${filteredDocs.length}/${documents.length} tài liệu` : `Showing ${filteredDocs.length}/${documents.length}`}
                </span>
                {(searchFilter || selectedLetter !== 'ALL' || filterType !== 'all') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] text-red-600 hover:text-red-700 dark:text-amber-400 font-sans font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Đặt lại</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Document Cards Grid or Empty State */}
          {filteredDocs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800">
              <Search className="w-8 h-8 text-slate-400 mb-2" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                {lang === 'vi' ? 'Không tìm thấy tài liệu phù hợp' : 'No matching documents found'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mb-3">
                {lang === 'vi'
                  ? `Không có tài liệu nào khớp với từ khóa "${searchFilter}" ${selectedLetter !== 'ALL' ? `hoặc chữ cái "${selectedLetter}"` : ''}. Thử tìm bằng từ khóa khác hoặc gõ tiếng Việt không dấu.`
                  : 'Try searching with another keyword or clearing filters.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm cursor-pointer"
              >
                {lang === 'vi' ? 'Xóa bộ lọc & Hiển thị tất cả' : 'Clear filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {filteredDocs.map((doc) => {
                const cardTheme = getCardTheme(doc.file_type);
                return (
                  <div
                    key={doc.id}
                    className={`group rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between shadow-xs hover:shadow-md ${
                      cardTheme.bg
                    } ${
                      isLight
                        ? 'border-slate-200/90 hover:border-blue-400'
                        : 'border-slate-800 hover:border-blue-500'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl flex items-center justify-center ${cardTheme.iconBox}`}>
                          {doc.file_type === 'pdf' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <FileSpreadsheet className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${cardTheme.versionBadge}`}>
                            v{doc.current_version}.0
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>{t.indexedStatus}</span>
                          </span>
                        </div>
                      </div>

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

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(doc.created_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}</span>
                        </span>
                        <span>{formatFileSize(doc.file_size_bytes)}</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t.viewCard}</span>
                      </button>

                      {onAskAI && (
                        <button
                          onClick={() => onAskAI(doc)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span>{t.askAI}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DocumentDiffModal isOpen={isDiffOpen} onClose={() => setIsDiffOpen(false)} />
    </div>
  );
};
