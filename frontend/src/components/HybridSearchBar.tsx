import React, { useState, useRef, useEffect } from 'react';
import { Search, X, FileText, Sparkles, ArrowRight, CornerDownLeft, Zap } from 'lucide-react';
import { SearchResult } from '../types';
import { ApiService } from '../services/api';

interface HybridSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (docId: number) => void;
}

export const HybridSearchBar: React.FC<HybridSearchBarProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const executeSearch = async (val: string) => {
    const startTime = performance.now();
    setSearching(true);
    try {
      const res = await ApiService.searchHybrid(val);
      setResults(res);
      setLatencyMs(Math.round(performance.now() - startTime));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setResults([]);
      setSearching(false);
      setLatencyMs(null);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => {
      executeSearch(val);
    }, 220); // 220ms high-performance debounce
  };

  const quickQueries = [
    'Quy chế làm việc từ xa',
    'Hạn mức công tác phí khách sạn',
    'Tiêu chuẩn bảo mật Microservices',
    'Chấm công & Nghỉ phép',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#090e1a] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col shadow-indigo-500/10">
        {/* Search Input Bar */}
        <div className="h-14 border-b border-white/[0.08] px-4 flex items-center gap-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Tìm theo từ khóa (Mã hiệu, tên file) hoặc theo ý nghĩa câu hỏi..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => handleInputChange('')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-4 border-b border-white/[0.06] bg-slate-950/40">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>GỢI Ý TÌM KIẾM NHANH (HYBRID BM25 + DENSE)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    executeSearch(q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-indigo-950/50 text-slate-300 hover:text-indigo-200 border border-white/[0.06] text-xs transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {searching && (
            <div className="p-8 text-center text-xs font-mono text-cyan-300 flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Đang tính toán kết hợp BM25 + Dense Vector Search (L1 Caching)...</span>
            </div>
          )}

          {!searching && query && results.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">
              Không tìm thấy tài liệu phù hợp trong phạm vi quyền truy cập của bạn.
            </div>
          )}

          {results.map((r) => (
            <div
              key={r.document_id}
              onClick={() => {
                onSelectResult(r.document_id);
                onClose();
              }}
              className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-indigo-950/40 border border-white/[0.06] hover:border-indigo-500/40 cursor-pointer transition-all space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {r.document_title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                    Độ khớp: {(r.score * 100).toFixed(0)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-sans line-clamp-2 pl-8">
                {r.snippet}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Navigation Hints & Performance Metric */}
        <div className="h-10 border-t border-white/[0.08] px-4 flex items-center justify-between bg-slate-950/70 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Tìm kiếm Hybrid Search (BM25 + Dense)</span>
            {latencyMs !== null && (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Độ trễ: {latencyMs}ms (L1 Cached)</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-slate-400" /> Chọn xem
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
