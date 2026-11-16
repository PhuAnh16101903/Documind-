import React, { useState } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
  Calendar,
  Shield,
  Layers,
} from 'lucide-react';
import { Department } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  departments: Department[];
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  departments,
  onClose,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [deptId, setDeptId] = useState<number>(departments[0]?.id || 1);
  const [effectiveDate, setEffectiveDate] = useState('2026-01-01');
  const [expirationDate, setExpirationDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    { name: 'Xác thực định dạng & Sinh SHA-256 Checksum', desc: 'Kiểm tra tệp tin hợp lệ và không trùng lặp' },
    { name: 'Trích xuất nội dung đa định dạng & Cấu trúc bảng', desc: 'Xử lý cấu trúc đoạn văn, tiêu đề điều khoản' },
    { name: 'Phân đoạn ngữ nghĩa (Semantic Chunking)', desc: 'Cắt đoạn theo cấu trúc ngữ cảnh' },
    { name: 'Sinh Dense Vector Embeddings (Gemini API)', desc: 'Tạo vector 768 chiều biểu diễn ngữ nghĩa' },
    { name: 'Lập chỉ mục Hybrid Search & Kích hoạt RAG', desc: 'Ghi chỉ mục BM25 và Vector Database' },
  ];

  const handleStartUpload = () => {
    if (!file || !title) return;
    setIsProcessing(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          onUploadSuccess();
          onClose();
        }, 800);
      }
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload &amp; Lập Chỉ Mục Tài Liệu</h3>
              <p className="text-[11px] text-slate-500">Quy trình nạp tự động vào kho tri thức doanh nghiệp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isProcessing ? (
          <div className="space-y-4 text-xs">
            {/* Drag & Drop Zone */}
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 hover:bg-indigo-50/30 group">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 text-center">
                {file ? file.name : 'Kéo thả file PDF, Word (.docx), Excel (.xlsx) vào đây'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">Dung lượng tối đa 100MB • Tự động phân tích</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                  }
                }}
              />
            </label>

            {/* Document Details Form */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                  TIÊU ĐỀ VĂN BẢN CHÍNH THỨC
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Quy chế công tác phí quý 4..."
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    PHÒNG BAN QUẢN LÝ
                  </label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    NGÀY CÓ HIỆU LỰC
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Public toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 text-xs">Phạm vi công khai toàn doanh nghiệp</div>
                  <div className="text-[10px] text-slate-500">
                    Cho phép mọi phòng ban tra cứu mà không bị chặn bởi RBAC
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-white border-slate-300 focus:ring-0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleStartUpload}
                disabled={!file || !title}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bắt Đầu Lập Chỉ Mục Tự Động</span>
              </button>
            </div>
          </div>
        ) : (
          /* Ingestion Pipeline Visualizer */
          <div className="py-4 space-y-4 font-mono">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Pipeline Nạp Dữ Liệu &amp; Đánh Chỉ Mục</h4>
              <p className="text-[11px] text-slate-600 font-sans">
                Đang xử lý: <strong className="text-indigo-600">{title}</strong>
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {steps.map((st, idx) => {
                const isDone = currentStep > idx;
                const isCurrent = currentStep === idx;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isCurrent
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold">{st.name}</div>
                        <div className="text-[10px] opacity-80 font-sans">{st.desc}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold">
                      {isDone ? 'HOÀN THÀNH' : isCurrent ? 'ĐANG XỬ LÝ...' : 'CHỜ'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
