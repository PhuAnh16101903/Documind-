import React, { useState } from 'react';
import { Search, X, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { SearchResult, Document } from '../types';
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

  if (!isOpen) return null;

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await ApiService.searchHybrid(val);
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-[#0c111d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <!-- Search Input -->
        <div className="h-14 border-b border-slate-800 px-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm theo từ khóa (Mã văn bản, tên file) hoặc theo ý nghĩa câu hỏi..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => handleSearch('')} className="p-1 rounded hover:bg-slate-800 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
            ESC để đóng
          </kbd>
        </div>

        <!-- Search Results List -->
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {searching && (
            <div className="p-6 text-center text-xs font-mono text-cyan-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Đang tính toán kết hợp BM25 + Dense Vector Search...</span>
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
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {r.document_title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Relevance: {(r.score * 100).toFixed(0)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">{r.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
