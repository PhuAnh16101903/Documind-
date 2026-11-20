import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  FileText,
  Download,
  CheckCircle2,
  ListTree,
} from 'lucide-react';
import { Document, Citation } from '../types';
import { ApiService } from '../services/api';

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
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [resolvedDoc, setResolvedDoc] = useState<Document | null>(document);

  // Always load the full document chunks from the backend
  useEffect(() => {
    let active = true;
    ApiService.getDocuments().then((docs) => {
      if (!active) return;
      const targetId = citation?.document_id ?? document?.id;
      const targetTitle = (citation?.document_title ?? document?.title ?? '').trim().toLowerCase();
      const found =
        docs.find(
          (d) =>
            (targetId !== undefined && String(d.id) === String(targetId)) ||
            (targetTitle && d.title.trim().toLowerCase() === targetTitle)
        ) ||
        docs.find((d) => d.chunks && d.chunks.length > 0) ||
        document;
      if (found) {
        setResolvedDoc(found);
      }
    });
    return () => {
      active = false;
    };
  }, [document, citation]);

  const chunks = resolvedDoc?.chunks || [];

  // Determine which chunk index in the document matches the citation
  const matchedChunkIdx = React.useMemo(() => {
    if (!citation || chunks.length === 0) return -1;
    const citeQuote = (citation.exact_quoted_text || '').replace(/\.\.\.$/, '').trim().toLowerCase();
    const citeHeading = (citation.heading || '').trim().toLowerCase();

    if (citeQuote.length > 10) {
      const needle = citeQuote.slice(0, 60);
      const byQuote = chunks.findIndex((c) => c.text.toLowerCase().includes(needle));
      if (byQuote !== -1) return byQuote;
    }

    if (citeHeading && citeQuote.length > 5) {
      const needle = citeQuote.slice(0, 25);
      const byBoth = chunks.findIndex(
        (c) => (c.heading || '').toLowerCase() === citeHeading && c.text.toLowerCase().includes(needle)
      );
      if (byBoth !== -1) return byBoth;
    }

    if (citeHeading) {
      const byHeading = chunks.findIndex((c) => (c.heading || '').toLowerCase() === citeHeading);
      if (byHeading !== -1) return byHeading;
    }

    return 0;
  }, [citation, chunks]);

  // Smoothly scroll directly to that exact section in the full document
  useEffect(() => {
    const timer = setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [matchedChunkIdx, chunks.length, citation]);

  if (!document && !citation) return null;

  const title = resolvedDoc?.title || citation?.document_title || document?.title || 'Tài liệu';
  const fileName = resolvedDoc?.file_name || document?.file_name || `${title}.docx`;

  // Extract Table of Contents from the actual headings in the file
  const tocItems: { heading: string; chunkIdx: number }[] = [];
  const seenHeadings = new Set<string>();
  chunks.forEach((ch, idx) => {
    const h = (ch.heading || '').trim();
    if (h && h !== 'General' && !seenHeadings.has(h)) {
      seenHeadings.add(h);
      tocItems.push({ heading: h, chunkIdx: idx });
    }
  });

  const handleDownloadText = () => {
    const textContent =
      resolvedDoc?.content ||
      chunks.map((c) => `${c.heading ? c.heading + '\n' : ''}${c.text}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.txt') ? fileName : `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-6xl h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white select-none flex-shrink-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-slate-900 truncate">
                {fileName}
              </div>
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="text-emerald-700 flex items-center gap-1 font-sans font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Toàn bộ văn bản gốc đã tải lên ({chunks.length} mục)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleDownloadText}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Tải nội dung văn bản gốc"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải bản gốc</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Real Table of Contents + Full Original Document */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Table of Contents of the actual file */}
          <div className="w-72 border-r border-slate-200 bg-slate-50 flex-col hidden md:flex overflow-hidden flex-shrink-0">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <ListTree className="w-4 h-4 text-indigo-600" />
              <span>Mục Lục Báo Cáo</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {tocItems.map((item, idx) => {
                const isActive =
                  matchedChunkIdx !== -1 &&
                  chunks[matchedChunkIdx]?.heading === item.heading;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const el = sectionRefs.current[item.chunkIdx];
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-start gap-2 ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-950 font-bold border border-indigo-300'
                        : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    <span className="line-clamp-2 leading-snug">{item.heading}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Document View: Clean White Paper showing 100% of the uploaded document without yellow boxes */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100">
            <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans h-fit">
              {chunks.map((chunk, idx) => {
                const isTarget = idx === matchedChunkIdx;
                const prevHeading = idx > 0 ? chunks[idx - 1].heading : null;
                const showHeading =
                  chunk.heading &&
                  chunk.heading !== 'General' &&
                  chunk.heading !== prevHeading;

                return (
                  <div
                    key={idx}
                    ref={(el) => {
                      sectionRefs.current[idx] = el;
                      if (isTarget) {
                        (highlightRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                      }
                    }}
                    className="space-y-2"
                  >
                    {showHeading && (
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 pt-4">
                        {chunk.heading}
                      </h3>
                    )}

                    <div
                      className={`whitespace-pre-wrap leading-relaxed transition-all ${
                        isTarget
                          ? 'border-l-4 border-indigo-600 pl-4 py-2 bg-indigo-50/50 text-slate-950 font-medium rounded-r-lg'
                          : 'text-slate-700'
                      }`}
                    >
                      {chunk.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
