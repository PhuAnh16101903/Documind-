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
} from 'lucide-react';
import { Document, UIThemeId } from '../types';
import { THEMES } from '../theme/themes';

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
    <div className={`flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 ${activeTheme.bgClass} transition-colors duration-300`}>
      {/* Page Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${activeTheme.borderClass}`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`text-xl font-extrabold text-white tracking-tight ${activeTheme.fontHeading}`}>
              Kho Tri Thức Tài Liệu Doanh Nghiệp
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/20">
              {filteredDocs.length} tài liệu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Tài liệu đã lập chỉ mục Hybrid Search &amp; phân đoạn ngữ nghĩa, sẵn sàng truy xuất có kiểm chứng
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/[0.08]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem dạng Bento Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem dạng Bảng"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenUpload}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2 ${activeTheme.buttonClass}`}
          >
            <span>Thêm Tài Liệu Mới</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-white/[0.06]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Lọc tài liệu theo tên hoặc mã..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-950/70 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'pdf', 'docx', 'xlsx'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                filterType === type
                  ? `${activeTheme.activePillClass} font-bold`
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
              }`}
            >
              {type === 'all' ? 'Tất cả định dạng' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area: Grid / Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={`${activeTheme.cardClass} rounded-2xl p-5 cursor-pointer relative group flex flex-col justify-between transition-all duration-200`}
            >
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/[0.08] group-hover:border-white/20 transition-colors">
                    {getFileIcon(doc.file_type)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-white/[0.06]">
                      v{doc.current_version}.0
                    </span>
                    {doc.is_public && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Public
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                  {doc.file_name}
                </p>

                {/* Temporal validity badge */}
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Hiệu lực: <strong className="text-slate-200">2026 – Hiện hành</strong></span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {formatFileSize(doc.file_size_bytes)}
                </span>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>RAG Ready</span>
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-white transition-all">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`border ${activeTheme.borderClass} rounded-2xl overflow-hidden bg-slate-900/60 shadow-xl`}>
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
    </div>
  );
};
