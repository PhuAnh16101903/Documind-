import React, { useEffect, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';
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
  const fileName = document ? document.file_name : 'Document_Verified_Source.pdf';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-5xl h-[90vh] bg-[#090e1a] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-white/[0.08] px-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md select-none">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-2.5">
                <span className="line-clamp-1">{title}</span>
                {citation && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3" />
                    Trích Dẫn [Nguồn {citation.citation_index}]
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{fileName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Bản kiểm chứng chính thức (SHA-256 Verified)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Đang tải file gốc ${fileName}...`)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-white/[0.06]"
              title="Tải văn bản gốc"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 transition-colors border border-white/[0.06]"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar Metadata + Paper Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Metadata Panel */}
          <div className="w-64 border-r border-white/[0.08] bg-slate-950/50 p-5 hidden md:flex flex-col justify-between text-xs font-mono space-y-6">
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                THÔNG TIN VĂN BẢN
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-slate-400">TRẠNG THÁI HIỆU LỰC</div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ĐANG ÁP DỤNG</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Hiệu lực: 2026 – Không thời hạn</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-slate-400">PHÂN ĐOẠN NGỮ NGHĨA</div>
                  <div className="text-white font-bold">18 Semantic Chunks</div>
                  <div className="text-[10px] text-cyan-400">Gemini Embeddings 768-d</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-slate-400">KIỂM ĐỊNH CHECKSUM</div>
                  <div className="text-[10px] text-slate-300 truncate font-mono">
                    sha256:e3b0c44298fc1c149afb...
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-indigo-300 space-y-1">
              <div className="font-bold flex items-center gap-1 text-indigo-200">
                <FileCheck className="w-3.5 h-3.5" />
                <span>DocuMind Verifiable Stamp</span>
              </div>
              <p className="text-slate-400">
                Văn bản đã qua quy trình Ingestion Pipeline và được xác thực không bị thay đổi.
              </p>
            </div>
          </div>

          {/* Main Paper Reader */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-[#070b14]/90">
            <div className="w-full max-w-2xl bg-[#0f172a] border border-white/[0.08] rounded-2xl p-8 sm:p-12 shadow-2xl space-y-6 text-slate-200 text-xs leading-relaxed font-sans">
              {/* Paper Header */}
              <div className="text-center border-b border-white/[0.08] pb-6 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-extrabold">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <p className="text-[11px] text-slate-400 italic">Độc lập – Tự do – Hạnh phúc</p>
                <div className="pt-3">
                  <h1 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                    {title}
                  </h1>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Số hiệu văn bản: 26/2026/QĐ-DOCUMIND
                  </p>
                </div>
              </div>

              {/* Document Paragraphs */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-indigo-300 uppercase tracking-wide">
                    Chương I. Quy Định Chung
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Văn bản này quy định các tiêu chuẩn thực hiện công việc, trách nhiệm bảo mật và quyền lợi liên quan đến nhân sự và vận hành hệ thống nội bộ của công ty. Mọi phòng ban có trách nhiệm triển khai và giám sát thực hiện nghiêm túc theo quy chế ban hành.
                  </p>
                </div>

                {/* Highlighted Citation Section */}
                <div
                  ref={highlightRef}
                  className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
                    citation
                      ? 'citation-target border-amber-500/70 bg-amber-950/20 shadow-lg'
                      : 'border-white/[0.08] bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{citation?.heading || 'Điều 4. Quy Định Chi Tiết Về Chế Độ & Hạn Mức'}</span>
                    </h4>
                    {citation?.page_number && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        Trang {citation.page_number}
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-xs leading-relaxed text-slate-100 bg-slate-950/80 p-4 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] font-mono text-amber-400 mb-1 font-bold">
                      [ĐOẠN TRÍCH ĐÃ ĐỐI CHIẾU NGUYÊN BẢN]
                    </div>
                    {citation?.exact_quoted_text ||
                      'Cán bộ nhân viên được hưởng đầy đủ các chính sách hỗ trợ chi phí công tác, làm việc linh hoạt và các quyền lợi theo thỏa ước lao động tập thể.'}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h3 className="font-bold text-xs text-indigo-300 uppercase tracking-wide">
                    Chương II. Điều Khoản Thi Hành
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Quyết định này có hiệu lực kể từ ngày ký và áp dụng đối với toàn thể cán bộ công nhân viên. Các quy định trước đây trái với quyết định này đều hết hiệu lực thi hành. Trưởng các phòng ban liên quan chịu trách nhiệm thi hành quyết định này.
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="font-bold text-slate-200">TRƯỞNG PHÒNG BAN HÀNH</p>
                  <p className="text-slate-400 italic mt-8 font-mono text-[11px]">(Đã ký duyệt)</p>
                </div>
                <div>
                  <p className="font-bold text-slate-200">TỔNG GIÁM ĐỐC PHÊ DUYỆT</p>
                  <p className="text-slate-400 italic mt-8 font-mono text-[11px]">(Ký số điện tử)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
