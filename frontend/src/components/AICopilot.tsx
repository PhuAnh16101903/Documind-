import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';
import { ChatMessage, Citation } from '../types';
import { ApiService } from '../services/api';

interface AICopilotProps {
  onCitationClick: (citation: Citation) => void;
}

export const AICopilot: React.FC<AICopilotProps> = ({ onCitationClick }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Xin chào! Tôi là **DocuMind Copilot**. Tôi đã lập chỉ mục toàn bộ tài liệu nội bộ được cấp quyền của bạn.\n\nMọi câu trả lời của tôi đều tuân thủ nguyên tắc **Strict Grounding** (chỉ dựa trên tài liệu thực tế) và kèm theo **trích dẫn nguồn có kiểm chứng** để bạn đối chiếu văn bản gốc.',
      timestamp: 'Vừa xong',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText?: string) => {
    const q = questionText || input.trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await ApiService.queryCopilot(q);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.answer,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Tài liệu nội bộ hiện không đề cập đến thông tin này hoặc chưa tìm thấy nguồn đủ tin cậy để trả lời.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-hidden">
      <!-- Chat Header -->
      <div className="h-12 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/40 select-none">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">AI Copilot &amp; Verifiable RAG</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Strict Grounding Active
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>RBAC Department Scoped</span>
        </div>
      </div>

      <!-- Messages Area -->
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-2xl space-y-2.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-xl'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <!-- Citations Badges (Verifiable Retrieval) -->
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                      <span>Nguồn Trích Dẫn Kiểm Chứng ({msg.citations.length}):</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.citation_index}
                          onClick={() => onCitationClick(cite)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-900/40 text-[11px] font-mono text-indigo-300 flex items-center gap-1.5 transition-all group"
                        >
                          <span className="w-4 h-4 rounded bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                            {cite.citation_index}
                          </span>
                          <span className="font-semibold text-slate-200">{cite.document_title}</span>
                          {cite.page_number && <span className="text-slate-400">• Trang {cite.page_number}</span>}
                          {cite.heading && <span className="text-slate-400 truncate max-w-[120px]">• {cite.heading}</span>}
                          <ExternalLink className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-500 px-1">{msg.timestamp}</div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0 mt-0.5">
                U
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <span>Đang truy xuất Hybrid Search &amp; tổng hợp nguồn có kiểm chứng...</span>
            </div>
          </div>
        )}
      </div>

      <!-- Quick Prompt Suggestions & Input Box -->
      <div className="p-4 border-t border-slate-800 bg-[#0c111d]">
        <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-500 font-mono text-[10px] flex items-center gap-1 flex-shrink-0">
            <HelpCircle className="w-3 h-3" /> Gợi ý:
          </span>
          <button
            onClick={() => handleSend('Quy chế làm việc từ xa tối đa mấy ngày một tuần?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap"
          >
            Quy chế làm việc từ xa (HR)
          </button>
          <button
            onClick={() => handleSend('Hạn mức tiền phòng khách sạn khi đi công tác là bao nhiêu?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap"
          >
            Hạn mức khách sạn công tác (FIN)
          </button>
          <button
            onClick={() => handleSend('Tiêu chuẩn kiến trúc bảo mật Microservices quy định gì?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap"
          >
            Bảo mật Microservices (TECH)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi bất kỳ điều gì dựa trên kho tri thức tài liệu nội bộ..."
            className="flex-1 h-10 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
