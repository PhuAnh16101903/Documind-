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
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-slate-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Kho Tri Thức Tài Liệu
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300 font-semibold">
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
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Xem dạng Lưới"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Xem dạng Bảng"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsDiffOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-300 hover:border-slate-400 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="So sánh thay đổi giữa 2 phiên bản tài liệu"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
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
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'pdf', 'docx', 'xlsx'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterType === type
                  ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
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
              className="bg-white hover:border-indigo-300 hover:shadow-md border border-slate-200 rounded-xl p-5 cursor-pointer relative group flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    {getFileIcon(doc.file_type)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      v{doc.current_version}.0
                    </span>
                    {doc.is_public && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                        Nội bộ
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                  {doc.file_name}
                </p>

                {/* Temporal validity badge */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hiệu lực: <strong className="text-slate-700">2026 – Hiện hành</strong></span>
                </div>
              </div>

              <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500 font-medium">
                  {formatFileSize(doc.file_size_bytes)}
                </span>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Đã chỉ mục</span>
                  </span>
                  <div className="p-1 rounded text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
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
