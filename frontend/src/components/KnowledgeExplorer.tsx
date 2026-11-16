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

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileCode className="w-5 h-5 text-indigo-400" />;
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
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-slate-950">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Kho Tri Thức Tài Liệu
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-850 text-slate-400 border border-slate-800">
              {filteredDocs.length} tài liệu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý tài liệu đã lập chỉ mục Hybrid Search &amp; phân đoạn văn bản cho AI Copilot
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem dạng Lưới"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem dạng Bảng"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsDiffOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-medium border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5"
            title="So sánh thay đổi giữa 2 phiên bản tài liệu"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
            <span>So Sánh Phiên Bản</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Lọc nhanh theo tên tài liệu..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'pdf', 'docx', 'xlsx'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterType === type
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-medium'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {type === 'all' ? 'Tất cả' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area: Grid / Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="bg-slate-900/70 hover:bg-slate-850/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer relative group flex flex-col justify-between transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60">
                    {getFileIcon(doc.file_type)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      v{doc.current_version}.0
                    </span>
                    {doc.is_public && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                        Nội bộ
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                  {doc.file_name}
                </p>

                {/* Temporal validity badge */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Hiệu lực: <strong className="text-slate-300">2026 – Hiện hành</strong></span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {formatFileSize(doc.file_size_bytes)}
                </span>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Đã chỉ mục</span>
                  </span>
                  <div className="p-1 rounded text-slate-500 group-hover:text-slate-300 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-[11px] font-mono uppercase tracking-wider text-slate-300 border-b border-white/[0.06]">
              <tr>
                <th className="p-4 pl-5">Tài Liệu</th>
                <th className="p-4">Định Dạng</th>
                <th className="p-4">Dung Lượng</th>
                <th className="p-4">Phiên Bản</th>
                <th className="p-4">Trạng Thái AI Indexing</th>
                <th className="p-4 text-right pr-5">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                >
                  <td className="p-4 pl-5">
                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-white/[0.08] group-hover:border-white/20 transition-colors">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{doc.file_name}</span>
                          {doc.is_public && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-sans">
                              Công khai toàn cty
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono uppercase text-[11px] text-slate-400">
                    {doc.file_type}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {formatFileSize(doc.file_size_bytes)}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/[0.08]">
                      v{doc.current_version}.0
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>INDEXED (RAG Ready)</span>
                    </span>
                  </td>
                  <td className="p-4 text-right pr-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDocument(doc);
                      }}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-400 transition-all border border-white/[0.08]"
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
