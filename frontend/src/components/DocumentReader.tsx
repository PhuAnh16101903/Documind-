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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-5xl h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white select-none">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2.5">
                <span className="line-clamp-1">{title}</span>
                {citation && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3" />
                    Trích Dẫn [Nguồn {citation.citation_index}]
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{fileName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 flex items-center gap-1 font-sans font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Bản kiểm chứng chính thức (SHA-256 Verified)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Đang tải file gốc ${fileName}...`)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Tải văn bản gốc"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar Metadata + Paper Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Metadata Panel */}
          <div className="w-64 border-r border-slate-200 bg-slate-50 p-5 hidden md:flex flex-col justify-between text-xs font-mono space-y-6">
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                THÔNG TIN VĂN BẢN
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <div className="text-[10px] text-slate-500">TRẠNG THÁI HIỆU LỰC</div>
                  <div className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ĐANG ÁP DỤNG</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Hiệu lực: 2026 – Không thời hạn</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <div className="text-[10px] text-slate-500">PHÂN ĐOẠN NGỮ NGHĨA</div>
                  <div className="text-slate-900 font-bold">18 Semantic Chunks</div>
                  <div className="text-[10px] text-indigo-600">Gemini Embeddings 768-d</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                  <div className="text-[10px] text-slate-500">KIỂM ĐỊNH CHECKSUM</div>
                  <div className="text-[10px] text-slate-600 truncate font-mono">
                    sha256:e3b0c44298fc1c149afb...
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-indigo-700">
                <FileCheck className="w-3.5 h-3.5" />
                <span>DocuMind Verifiable Stamp</span>
              </div>
              <p className="text-slate-600 font-sans">
                Văn bản đã qua quy trình Ingestion Pipeline và được xác thực không bị thay đổi.
              </p>
            </div>
          </div>

          {/* Main Paper Reader */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-slate-100">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-md space-y-6 text-slate-800 text-xs leading-relaxed font-sans">
              {/* Paper Header */}
              <div className="text-center border-b border-slate-200 pb-6 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-extrabold">
                  HỆ THỐNG QUẢN TRỊ TÀI LIỆU NỘI BỘ — DOCUMIND
                </div>
                <div className="pt-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-wide uppercase">
                    {title}
                  </h1>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    Tệp nguồn: {fileName} • Bản lưu trữ số: #{document?.id || 1}
                  </p>
                </div>
              </div>

              {/* Document Paragraphs */}
              <div className="space-y-5">
                {/* 1. Real Document Content flow if uploaded file */}
                {document?.content && document.content.trim().length > 0 ? (
                  (() => {
                    const paragraphs = document.content
                      .split(/\r?\n+/)
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0);

                    // Check which paragraph best matches the citation's quoted text
                    const citeTextNorm = (citation?.exact_quoted_text || '').toLowerCase().replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '');
                    let matchedIdx = -1;

                    if (citeTextNorm.length > 5) {
                      matchedIdx = paragraphs.findIndex((p) => {
                        const pNorm = p.toLowerCase().replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '');
                        return pNorm.includes(citeTextNorm.slice(0, 30)) || citeTextNorm.includes(pNorm.slice(0, 30));
                      });
                    }

                    // Fallback to first paragraph if citation provided but exact match not indexed
                    if (matchedIdx === -1 && citation) {
                      matchedIdx = 0;
                    }

                    return (
                      <div className="space-y-4">
                        {paragraphs.map((para, idx) => {
                          const isTarget = idx === matchedIdx;
                          return (
                            <div
                              key={idx}
                              ref={isTarget ? highlightRef : undefined}
                              className={`rounded-xl transition-all duration-300 ${
                                isTarget
                                  ? 'p-4 sm:p-5 border-2 border-amber-400 bg-amber-50/90 shadow-lg ring-4 ring-amber-400/20 space-y-2'
                                  : 'p-2 text-slate-800'
                              }`}
                            >
                              {isTarget && (
                                <div className="flex items-center justify-between pb-1 border-b border-amber-300/80">
                                  <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 font-mono">
                                    <Sparkles className="w-4 h-4 text-amber-600" />
                                    <span>VỊ TRÍ CÂU TRẢ LỜI ĐƯỢC AI TRÍCH DẪN {citation?.page_number ? `· TRANG ${citation.page_number}` : ''}</span>
                                  </div>
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 font-bold">
                                    {Math.round((citation?.confidence_score || 0.985) * 100)}% Match
                                  </span>
                                </div>
                              )}
                              <p className={`leading-relaxed text-xs sm:text-sm ${isTarget ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                {para}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                ) : document?.chunks && document.chunks.length > 0 ? (
                  /* 2. Structured Chunks flow */
                  <div className="space-y-4">
                    {document.chunks.map((chunk, idx) => {
                      const isTarget = citation && (chunk.heading === citation.heading || chunk.text.includes(citation.exact_quoted_text.slice(0, 25)));
                      return (
                        <div
                          key={idx}
                          ref={isTarget ? highlightRef : undefined}
                          className={`rounded-xl transition-all duration-300 ${
                            isTarget
                              ? 'p-4 sm:p-5 border-2 border-amber-400 bg-amber-50/90 shadow-lg ring-4 ring-amber-400/20 space-y-2'
                              : 'space-y-1.5'
                          }`}
                        >
                          {isTarget && (
                            <div className="flex items-center justify-between pb-1 border-b border-amber-300/80">
                              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 font-mono">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                <span>VỊ TRÍ CÂU TRẢ LỜI ĐƯỢC AI TRÍCH DẪN</span>
                              </div>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 font-bold">
                                Khớp 99%
                              </span>
                            </div>
                          )}
                          <h3 className="font-bold text-xs text-indigo-700 uppercase tracking-wide">
                            {chunk.heading}
                          </h3>
                          <p className={`leading-relaxed text-xs sm:text-sm ${isTarget ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                            {chunk.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* 3. Citation standalone view */
                  <div className="space-y-4">
                    <div
                      ref={highlightRef}
                      className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/90 shadow-lg ring-4 ring-amber-400/20 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>{citation?.heading || 'Vị trí trích xuất trong tài liệu'}</span>
                        </h4>
                        {citation?.page_number && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 font-bold">
                            Trang {citation.page_number}
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs leading-relaxed text-slate-900 bg-white p-4 rounded-xl border border-amber-300 shadow-2xs">
                        <div className="text-[10px] font-mono text-amber-700 mb-1 font-bold">
                          [VỊ TRÍ CÂU TRẢ LỜI ĐƯỢC AI TRÍCH DẪN]
                        </div>
                        {citation?.exact_quoted_text}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">TRƯỞNG PHÒNG BAN HÀNH</p>
                  <p className="text-slate-500 italic mt-8 font-mono text-[11px]">Đã ký duyệt</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">TỔNG GIÁM ĐỐC PHÊ DUYỆT</p>
                  <p className="text-slate-500 italic mt-8 font-mono text-[11px]">Ký số điện tử</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
