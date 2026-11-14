import React, { useEffect, useRef } from 'react';
import { X, FileText, Download, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Document, Citation } from '../types';

interface DocumentReaderProps {
  document: Document | null;
  citation: Citation | null;
  onClose: () => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  document,
  citation,
  onClose,
}) => {
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (citation && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [citation]);

  if (!document && !citation) return null;

  const title = citation ? citation.document_title : document?.title;
  const fileName = document ? document.file_name : 'Document_Preview.pdf';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[88vh] bg-[#0c111d] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-14 border-b border-slate-800 px-5 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>{title}</span>
                {citation && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Trích dẫn [Nguồn {citation.citation_index}]
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>{fileName}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Bản kiểm chứng chính thức
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Đang tải file ${fileName}...`)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Tải file gốc"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewer Content Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-950/80">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-6 text-slate-200 text-xs leading-relaxed font-serif">
            {/* Header Paper Simulation */}
            <div className="text-center border-b border-slate-800 pb-5 font-sans space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <p className="text-[10px] text-slate-400">Độc lập – Tự do – Hạnh phúc</p>
              <div className="pt-2">
                <h1 className="text-base font-extrabold text-white tracking-wide uppercase">{title}</h1>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Số hiệu: 26/2026/QĐ-DOCUMIND</p>
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4">
              <div className="font-sans space-y-1">
                <h3 className="font-bold text-xs text-indigo-400">Chương I. Quy Định Chung</h3>
                <p>
                  Văn bản này quy định các tiêu chuẩn thực hiện công việc, trách nhiệm bảo mật và quyền lợi liên quan đến nhân sự và vận hành hệ thống nội bộ của công ty. Mọi phòng ban có trách nhiệm triển khai và giám sát thực hiện nghiêm túc.
                </p>
              </div>

              {/* Active Highlight Section (Citation Target) */}
              <div
                ref={highlightRef}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2 ${
                  citation
                    ? 'citation-target border-amber-500/60 bg-amber-950/30'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between font-sans">
                  <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{citation?.heading || 'Điều 4. Quy Định Chi Tiết Về Chế Độ & Hạn Mức'}</span>
                  </h4>
                  {citation?.page_number && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Trang {citation.page_number}
                    </span>
                  )}
                </div>

                <p className="font-mono text-[11px] leading-relaxed text-slate-100 bg-black/40 p-3 rounded-lg border border-amber-500/30">
                  {citation?.exact_quoted_text ||
                    'Cán bộ nhân viên được hưởng đầy đủ các chính sách hỗ trợ chi phí công tác, làm việc linh hoạt và các quyền lợi theo thỏa ước lao động tập thể.'}
                </p>
              </div>

              <div className="font-sans space-y-1 pt-2">
                <h3 className="font-bold text-xs text-indigo-400">Chương II. Điều Khoản Thi Hành</h3>
                <p>
                  Quyết định này có hiệu lực kể từ ngày ký. Các quy định trước đây trái với quyết định này đều bị bãi bỏ. Trưởng các phòng ban liên quan chịu trách nhiệm thi hành quyết định này.
                </p>
              </div>
            </div>

            {/* Signature footer */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 text-center font-sans text-[11px]">
              <div>
                <p className="font-bold text-slate-300">TRƯỞNG PHÒNG BAN HÀNH</p>
                <p className="text-slate-500 italic mt-8">(Đã ký duyệt)</p>
              </div>
              <div>
                <p className="font-bold text-slate-300">TỔNG GIÁM ĐỐC PHÊ DUYỆT</p>
                <p className="text-slate-500 italic mt-8">(Đã ký duyệt điện tử)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
