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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="h-14 border-b border-slate-200 px-4 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Tìm theo từ khóa (Mã hiệu, tên file) hoặc theo ý nghĩa câu hỏi..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => handleInputChange('')}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600" />
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
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-xs transition-colors shadow-2xs font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2 bg-slate-50">
          {searching && (
            <div className="p-8 text-center text-xs font-mono text-indigo-600 flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Đang tính toán kết hợp BM25 + Dense Vector Search (L1 Caching)...</span>
            </div>
          )}

          {!searching && query && results.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
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
              className="p-3.5 rounded-xl bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all space-y-1.5 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {r.document_title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Độ khớp: {(r.score * 100).toFixed(0)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-sans line-clamp-2 pl-8">
                {r.snippet}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Navigation Hints & Performance Metric */}
        <div className="h-10 border-t border-slate-200 px-4 flex items-center justify-between bg-white text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>Tìm kiếm Hybrid Search (BM25 + Dense)</span>
            {latencyMs !== null && (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3 text-emerald-600" />
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
