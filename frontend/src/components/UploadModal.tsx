import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';
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
  const [isPublic, setIsPublic] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    'Kiểm tra định dạng & SHA-256 Checksum',
    'Trích xuất văn bản & cấu trúc bảng biểu',
    'Phân đoạn ngữ nghĩa (Semantic Chunking)',
    'Sinh Vector Embeddings (Gemini Embeddings)',
    'Lập chỉ mục Hybrid Search & Kích hoạt RAG',
  ];

  const handleStartUpload = () => {
    if (!file || !title) return;
    setIsProcessing(true);

    // Simulate real Ingestion Pipeline progress
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0c111d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Upload &amp; Lập Chỉ Mục Tài Liệu Mới</h3>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isProcessing ? (
          <div className="space-y-4 text-xs">
            <!-- Drag and Drop Zone -->
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="font-semibold text-slate-200">
                {file ? file.name : 'Kéo thả file PDF, Word (.docx), Excel (.xlsx) vào đây'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">Dung lượng tối đa 100MB</span>
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

            <!-- Document Details Form -->
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">TÊN HIỂN THỊ TÀI LIỆU</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Quy chế công tác phí quý 4..."
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">PHÒNG BAN QUẢN LÝ (RBAC)</label>
                <select
                  value={deptId}
                  onChange={(e) => setDeptId(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="chkPublic" className="text-slate-300 text-xs cursor-pointer">
                  Tài liệu dùng chung (Cho phép mọi phòng ban tra cứu)
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
                Hủy
              </button>
              <button
                onClick={handleStartUpload}
                disabled={!file || !title}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Bắt Đầu Nạp Vào Kho Tri Thức
              </button>
            </div>
          </div>
        ) : (
          <!-- Processing Pipeline Step Animator -->
          <div className="py-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="text-xs font-bold text-white tracking-wide">Đang Xử Lý Đường Ống Ingestion</div>
              <p className="text-[11px] font-mono text-slate-400">File: {file?.name}</p>
            </div>

            <div className="space-y-2.5 pt-2">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    i < currentStep
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : i === currentStep
                      ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300 animate-pulse'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px]">#{i + 1}</span>
                    <span>{st}</span>
                  </span>
                  {i < currentStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {i === currentStep && <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
