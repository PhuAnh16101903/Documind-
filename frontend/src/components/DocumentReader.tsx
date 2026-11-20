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

interface RichBlock {
  type: 'heading' | 'paragraph' | 'table' | 'image';
  text?: string;
  heading?: string;
  rows?: string[][];
  src?: string;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  document,
  citation,
  onClose,
}) => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [resolvedDoc, setResolvedDoc] = useState<Document | null>(document);
  const [richBlocks, setRichBlocks] = useState<RichBlock[]>([]);

  // Load document metadata & full rich blocks (headings, paragraphs, real tables, embedded images)
  useEffect(() => {
    let active = true;
    const load = async () => {
      const docs = await ApiService.getDocuments();
      if (!active) return;

      const targetId = citation?.document_id ?? document?.id;
      const targetTitle = (citation?.document_title ?? document?.title ?? '').trim().toLowerCase();
      const found =
        docs.find(
          (d) =>
            (targetId !== undefined && String(d.id) === String(targetId)) ||
            (targetTitle && d.title.trim().toLowerCase() === targetTitle)
        ) ||
        docs[0] ||
        document;

      if (found) {
        setResolvedDoc(found);
        const rich = await ApiService.getDocumentRichView(found.id);
        if (active && rich && Array.isArray(rich.blocks) && rich.blocks.length > 0) {
          setRichBlocks(rich.blocks);
          return;
        }
        // Fallback: convert chunks to richBlocks (including parsing [Bảng #X] into 2D table rows)
        if (active && found.chunks) {
          const fallbackBlocks: RichBlock[] = [];
          let lastH = '';
          found.chunks.forEach((c) => {
            if (c.heading && c.heading !== 'General' && c.heading !== lastH) {
              lastH = c.heading;
              fallbackBlocks.push({ type: 'heading', text: c.heading, heading: c.heading });
            }
            if (c.text.startsWith('[Bảng #')) {
              const lines = c.text.split('\n').slice(1).filter((l) => l.trim());
              const rows = lines.map((l) => l.split(' | ').map((cell) => cell.trim()));
              fallbackBlocks.push({ type: 'table', rows, heading: c.heading, text: c.text });
            } else {
              fallbackBlocks.push({ type: 'paragraph', text: c.text, heading: c.heading });
            }
          });
          setRichBlocks(fallbackBlocks);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [document, citation]);

  // Determine which block index matches the citation
  const matchedBlockIdx = React.useMemo(() => {
    if (!citation || richBlocks.length === 0) return -1;
    const citeQuote = (citation.exact_quoted_text || '').replace(/\.\.\.$/, '').trim().toLowerCase();
    const citeLines = citeQuote.split('\n').map((l) => l.trim()).filter((l) => l.length > 10);
    const firstLine = citeLines[0] || citeQuote.slice(0, 45);
    const citeHeading = (citation.heading || '').trim().toLowerCase();

    if (firstLine.length > 8) {
      const idx = richBlocks.findIndex(
        (b) => b.type !== 'image' && (b.text || '').toLowerCase().includes(firstLine.slice(0, 40))
      );
      if (idx !== -1) return idx;
    }

    if (citeHeading && citeHeading !== 'general') {
      const idx = richBlocks.findIndex(
        (b) => (b.heading || '').toLowerCase() === citeHeading || (b.text || '').toLowerCase() === citeHeading
      );
      if (idx !== -1) return idx;
    }

    return 0;
  }, [citation, richBlocks]);

  // Smoothly scroll directly to that exact section in the full document
  useEffect(() => {
    const timer = setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [matchedBlockIdx, richBlocks.length, citation]);

  if (!document && !citation) return null;

  const title = resolvedDoc?.title || citation?.document_title || document?.title || 'Tài liệu';
  const fileName = resolvedDoc?.file_name || document?.file_name || `${title}.docx`;

  // Build Table of Contents from heading blocks
  const tocItems: { heading: string; blockIdx: number }[] = [];
  const seenHeadings = new Set<string>();
  richBlocks.forEach((b, idx) => {
    if (b.type === 'heading' && b.text && !seenHeadings.has(b.text)) {
      seenHeadings.add(b.text);
      tocItems.push({ heading: b.text, blockIdx: idx });
    }
  });

  const handleDownloadText = () => {
    const textContent =
      resolvedDoc?.content ||
      richBlocks.map((b) => b.text || '').filter(Boolean).join('\n\n');
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
                  Bản gốc đầy đủ văn bản, bảng kẻ ô & hình ảnh từ tệp Word
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

        {/* Content Body: Real Table of Contents + Full Word Document View */}
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
                  matchedBlockIdx !== -1 &&
                  richBlocks[matchedBlockIdx]?.heading === item.heading;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const el = blockRefs.current[item.blockIdx];
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

          {/* Main Document View: Clean White Paper with real paragraphs, bordered tables, and embedded images */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100">
            <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm space-y-3.5 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans h-fit">
              {richBlocks.map((block, idx) => {
                const isTarget =
                  idx === matchedBlockIdx ||
                  (matchedBlockIdx !== -1 &&
                    idx > matchedBlockIdx &&
                    idx <= matchedBlockIdx + 3 &&
                    block.heading === richBlocks[matchedBlockIdx]?.heading &&
                    block.type === 'paragraph');

                return (
                  <div
                    key={idx}
                    ref={(el) => {
                      blockRefs.current[idx] = el;
                      if (idx === matchedBlockIdx) {
                        (highlightRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                      }
                    }}
                  >
                    {block.type === 'heading' && (
                      <h3
                        className={`font-bold text-sm sm:text-base text-slate-900 pt-4 pb-1 ${
                          idx === matchedBlockIdx
                            ? 'border-l-4 border-indigo-600 pl-3 bg-indigo-50/50 rounded-r-lg'
                            : ''
                        }`}
                      >
                        {block.text}
                      </h3>
                    )}

                    {block.type === 'paragraph' && (
                      <div
                        className={`whitespace-pre-wrap leading-relaxed transition-all ${
                          isTarget
                            ? 'border-l-4 border-indigo-600 pl-4 py-1.5 bg-indigo-50/50 text-slate-950 font-medium rounded-r-lg'
                            : 'text-slate-700'
                        }`}
                      >
                        {block.text}
                      </div>
                    )}

                    {block.type === 'table' && block.rows && block.rows.length > 0 && (
                      <div className="my-4 overflow-x-auto rounded-lg border border-slate-300 shadow-2xs">
                        <table className="w-full border-collapse text-xs text-left">
                          <thead>
                            <tr className="bg-slate-100 text-slate-900 font-bold">
                              {block.rows[0].map((cell, cIdx) => (
                                <th
                                  key={cIdx}
                                  className="border border-slate-300 px-3 py-2.5 align-top whitespace-pre-wrap"
                                >
                                  {cell}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.slice(1).map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="border border-slate-300 px-3 py-2 align-top whitespace-pre-wrap text-slate-700"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {block.type === 'image' && block.src && (
                      <div className="my-4 flex justify-center">
                        <img
                          src={block.src}
                          alt="Hình minh họa trong báo cáo"
                          className="max-w-full max-h-[460px] rounded-lg border border-slate-200 shadow-xs object-contain"
                        />
                      </div>
                    )}
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
