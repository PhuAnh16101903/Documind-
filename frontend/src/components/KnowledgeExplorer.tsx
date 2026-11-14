import React from 'react';
import { FileText, FileSpreadsheet, FileCode, Clock, CheckCircle2, AlertCircle, Eye, Tag } from 'lucide-react';
import { Document } from '../types';

interface KnowledgeExplorerProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onOpenUpload: () => void;
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
}) => {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileCode className="w-4 h-4 text-indigo-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Kho Tri Thức Tài Liệu Doanh Nghiệp</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tài liệu đã lập chỉ mục Hybrid Search &amp; sẵn sàng truy xuất bởi AI Copilot có kiểm chứng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            Tổng cộng: <strong className="text-indigo-400">{documents.length}</strong> tài liệu
          </span>
        </div>
      </div>

      {/* Document Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-[11px] font-mono uppercase tracking-wider text-slate-300 border-b border-slate-700/60">
            <tr>
              <th className="p-3.5 pl-4">Tài Liệu</th>
              <th className="p-3.5">Định Dạng</th>
              <th className="p-3.5">Dung Lượng</th>
              <th className="p-3.5">Phiên Bản</th>
              <th className="p-3.5">Trạng Thái AI Indexing</th>
              <th className="p-3.5 text-right pr-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
              >
                <td className="p-3.5 pl-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:border-indigo-500/50 transition-colors">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {doc.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
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
                <td className="p-3.5 font-mono uppercase text-[11px] text-slate-400">
                  {doc.file_type}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-400">
                  {formatFileSize(doc.file_size_bytes)}
                </td>
                <td className="p-3.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    v{doc.current_version}.0
                  </span>
                </td>
                <td className="p-3.5">
                  {doc.ingestion_status === 'INDEXED' ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>INDEXED (RAG Ready)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{doc.ingestion_status}</span>
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right pr-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDocument(doc);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-all border border-slate-700"
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
    </div>
  );
};
