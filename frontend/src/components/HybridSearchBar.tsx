import React, { useState, useRef, useEffect } from 'react';
import { Search, X, FileText, Sparkles, ArrowRight, CornerDownLeft, Zap } from 'lucide-react';
import { SearchResult } from '../types';
import { ApiService } from '../services/api';
import { Language, translations } from '../services/i18n';

interface HybridSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (docId: number) => void;
  lang?: Language;
}

export const HybridSearchBar: React.FC<HybridSearchBarProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  lang = 'vi',
}) => {
  const t = translations[lang];
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
    }, 220);
  };

  const quickQueries = [t.quickQ1, t.quickQ2, t.quickQ3, t.quickQ4];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center gap-3 bg-white dark:bg-slate-900">
          <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t.searchDialogPlaceholder}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => handleInputChange('')}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            onClick={onClose}
            className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200"
          >
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/50">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>{t.searchSuggestions}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quickQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInputChange(q)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/80">
          {searching && (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span>{lang === 'vi' ? 'Đang truy vấn Hybrid BM25 và Vector...' : 'Querying Hybrid BM25 and Vector Index...'}</span>
            </div>
          )}

          {!searching && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              {lang === 'vi' ? 'Không tìm thấy kết quả phù hợp với từ khóa này.' : 'No results found matching this keyword.'}
            </div>
          )}

          {!searching &&
            results.map((res) => (
              <div
                key={res.document_id}
                onClick={() => {
                  onSelectResult(res.document_id);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-indigo-50/60 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                      {res.document_title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-sans">
                      {res.snippet}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                    {Math.round(res.score * 100)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="h-9 px-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Hybrid Search BM25 + Dense</span>
            {latencyMs !== null && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Zap className="w-2.5 h-2.5" />
                <span>{latencyMs}ms</span>
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" />
            <span>{lang === 'vi' ? 'Chọn xem văn bản' : 'Press Enter to select'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
