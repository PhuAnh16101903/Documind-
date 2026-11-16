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
} from 'lucide-react';
import { Document, UIThemeId } from '../types';
import { THEMES } from '../theme/themes';
import { DocumentDiffModal } from './DocumentDiffModal';

interface KnowledgeExplorerProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onOpenUpload: () => void;
  currentTheme: UIThemeId;
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  currentTheme,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const activeTheme = THEMES[currentTheme];

  const getCardTheme = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return {
          stripe: 'from-rose-500 via-pink-500 to-rose-400',
          bg: 'bg-gradient-to-b from-rose-50/40 via-white to-white',
          hoverBorder: 'hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/10',
          iconBox: 'bg-gradient-to-br from-rose-50 to-pink-100 text-rose-600 border border-rose-200/80',
          versionBadge: 'bg-rose-50 text-rose-700 border border-rose-200',
          titleHover: 'group-hover:text-rose-600',
        };
      case 'docx':
      case 'doc':
        return {
          stripe: 'from-blue-500 via-indigo-500 to-cyan-400',
          bg: 'bg-gradient-to-b from-blue-50/40 via-white to-white',
          hoverBorder: 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10',
          iconBox: 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 border border-blue-200/80',
          versionBadge: 'bg-blue-50 text-blue-700 border border-blue-200',
          titleHover: 'group-hover:text-blue-600',
        };
      case 'xlsx':
      case 'xls':
        return {
          stripe: 'from-emerald-500 via-teal-500 to-emerald-400',
          bg: 'bg-gradient-to-b from-emerald-50/40 via-white to-white',
          hoverBorder: 'hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10',
          iconBox: 'bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600 border border-emerald-200/80',
          versionBadge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          titleHover: 'group-hover:text-emerald-600',
        };
      default:
        return {
          stripe: 'from-purple-500 via-indigo-500 to-purple-400',
          bg: 'bg-gradient-to-b from-purple-50/40 via-white to-white',
          hoverBorder: 'hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10',
          iconBox: 'bg-gradient-to-br from-purple-50 to-indigo-100 text-purple-600 border border-purple-200/80',
          versionBadge: 'bg-purple-50 text-purple-700 border border-purple-200',
          titleHover: 'group-hover:text-purple-600',
        };
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileCode className="w-5 h-5 text-indigo-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = filterType === 'all' || doc.file_type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-slate-50/80 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Kho Tri Thức Tài Liệu
            </h2>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-2xs">
              {filteredDocs.length} tài liệu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tài liệu đã lập chỉ mục Hybrid Search &amp; phân đoạn văn bản cho AI Copilot
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 border border-slate-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-2xs font-semibold scale-100'
                  : 'text-slate-500 hover:text-slate-900 hover:scale-105'
              }`}
              title="Xem dạng Lưới"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-2xs font-semibold scale-100'
                  : 'text-slate-500 hover:text-slate-900 hover:scale-105'
              }`}
              title="Xem dạng Bảng"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsDiffOpen(true)}
            className="group px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 text-xs font-semibold border border-indigo-200 hover:border-indigo-300 transition-all duration-200 flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
            title="So sánh thay đổi giữa 2 phiên bản tài liệu"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-180 transition-transform duration-500" />
            <span>So Sánh Phiên Bản</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Lọc nhanh theo tên tài liệu..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'pdf', 'docx', 'xlsx'].map((type) => {
            const isSelected = filterType === type;
            let activeStyle = 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-sm shadow-indigo-200';
            let hoverStyle = 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200';
            if (type === 'pdf') hoverStyle = 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 border border-slate-200';
            if (type === 'docx') hoverStyle = 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 border border-slate-200';
            if (type === 'xlsx') hoverStyle = 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-slate-600 border border-slate-200';

            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isSelected ? activeStyle : `bg-slate-50 ${hoverStyle}`
                }`}
              >
                {type === 'all' ? 'Tất cả' : type.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area: Grid / Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const cardTheme = getCardTheme(doc.file_type);
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className={`${cardTheme.bg} ${cardTheme.hoverBorder} border border-slate-200 rounded-xl p-5 cursor-pointer relative group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 overflow-hidden`}
              >
                {/* Colorful Top Accent Stripe */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${cardTheme.stripe} rounded-t-xl absolute top-0 left-0 transition-opacity duration-300 opacity-80 group-hover:opacity-100`} />

                <div>
                  <div className="flex items-start justify-between mb-3.5 pt-1">
                    <div className={`p-2.5 rounded-xl ${cardTheme.iconBox} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-2xs`}>
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-2xs ${cardTheme.versionBadge}`}>
                        v{doc.current_version}.0
                      </span>
                      {doc.is_public && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shadow-2xs">
                          Nội bộ
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className={`font-bold text-sm text-slate-900 ${cardTheme.titleHover} transition-colors line-clamp-2 leading-snug`}>
                    {doc.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                    {doc.file_name}
                  </p>

                  {/* Temporal validity badge */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    <span>Hiệu lực: <strong className="text-slate-700">2026 – Hiện hành</strong></span>
                  </div>
                </div>

                <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {formatFileSize(doc.file_size_bytes)}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>Đã chỉ mục</span>
                    </span>
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-2xs">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 pl-5">Tài Liệu</th>
                <th className="p-4">Định Dạng</th>
                <th className="p-4">Dung Lượng</th>
                <th className="p-4">Phiên Bản</th>
                <th className="p-4">Trạng Thái AI Indexing</th>
                <th className="p-4 text-right pr-5">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="p-4 pl-5">
                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 group-hover:border-indigo-300 transition-colors">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{doc.file_name}</span>
                          {doc.is_public && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-sans font-semibold">
                              Công khai toàn cty
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono uppercase text-[11px] text-slate-600">
                    {doc.file_type}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-600">
                    {formatFileSize(doc.file_size_bytes)}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      v{doc.current_version}.0
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>INDEXED (RAG Ready)</span>
                    </span>
                  </td>
                  <td className="p-4 text-right pr-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDocument(doc);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors border border-slate-200"
                      title="Mở xem tài liệu & kiểm chứng"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Document Version Diff & Audit Modal */}
      <DocumentDiffModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
      />
    </div>
  );
};
