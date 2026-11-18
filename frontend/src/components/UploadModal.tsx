import React, { useState } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  FileText,
  Sparkles,
  Calendar,
  Layers,
  Trash2,
  FileSpreadsheet,
  FileCode,
  FileCheck,
  FolderOpen,
} from 'lucide-react';
import { Department, Document } from '../types';
import { MockData } from '../services/api';

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
  const [files, setFiles] = useState<File[]>([]);
  const [deptId, setDeptId] = useState<number>(departments[0]?.id || 1);
  const [effectiveDate, setEffectiveDate] = useState('2026-01-01');
  const [isPublic, setIsPublic] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [currentStepName, setCurrentStepName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
    if (fileName.endsWith('.json') || fileName.endsWith('.md')) {
      return <FileCode className="w-4 h-4 text-purple-600" />;
    }
    return <FileText className="w-4 h-4 text-indigo-600" />;
  };

  const pipelineSteps = [
    'Xác thực SHA-256 Checksum & Khử trùng lặp',
    'Trích xuất văn bản, bảng biểu & Mục lục cấu trúc',
    'Phân đoạn ngữ nghĩa Semantic Chunking theo tiêu đề',
    'Sinh Vector Embeddings 768D chuẩn Gemini API',
    'Lập chỉ mục Hybrid BM25 & Kích hoạt RAG Grounding',
  ];

  const handleStartBatchUpload = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProcessedCount(0);

    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const currentFile = files[fIdx];
      for (let sIdx = 0; sIdx < pipelineSteps.length; sIdx++) {
        setCurrentStepName(`[${fIdx + 1}/${files.length}] ${currentFile.name}: ${pipelineSteps[sIdx]}`);
        await new Promise((r) => setTimeout(r, 220));
      }

      // Add to mock documents store
      const ext = currentFile.name.split('.').pop() || 'pdf';
      const newDoc: Document = {
        id: Date.now() + fIdx,
        title: currentFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        file_name: currentFile.name,
        file_type: ext,
        file_size_bytes: currentFile.size || 850000,
        department_id: deptId,
        approval_status: 'APPROVED',
        ingestion_status: 'INDEXED',
        is_public: isPublic,
        current_version: 1,
        created_at: new Date().toISOString(),
      };
      MockData.documents.unshift(newDoc);
      setProcessedCount(fIdx + 1);
    }

    await new Promise((r) => setTimeout(r, 400));
    setIsProcessing(false);
    onUploadSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Upload & Lập Chỉ Mục Đa Tài Liệu</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Batch Multi-File Ingestion
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cho phép chọn hoặc kéo thả nhiều tệp cùng lúc: PDF, Word, Excel, Markdown
              </p>
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
            {/* Multi-file Drag & Drop Zone */}
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/70 hover:bg-indigo-50/30 group">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform mb-2">
                <FolderOpen className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 text-center">
                Nhấp để chọn hoặc kéo thả nhiều tài liệu vào đây
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Hỗ trợ tải lên nhiều file cùng lúc • PDF, DOCX, XLSX, TXT, MD • Tối đa 100MB/tệp
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-semibold px-1">
                  <span>DANH SÁCH TÀI LIỆU ĐÃ CHỌN: {files.length} TỆP</span>
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="text-rose-600 hover:underline font-sans text-xs"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        {getFileIcon(f.name)}
                        <span className="font-medium text-slate-800 truncate">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                          ({formatFileSize(f.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                        title="Bỏ tệp này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Ingestion Settings */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                  PHÒNG BAN QUẢN LÝ TÀI LIỆU
                </label>
                <select
                  value={deptId}
                  onChange={(e) => setDeptId(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
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
                  NGÀY BẮT ĐẦU CÓ HIỆU LỰC
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Public toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 text-xs">
                  Phạm vi áp dụng toàn doanh nghiệp
                </div>
                <div className="text-[10px] text-slate-500">
                  Mọi nhân viên ở tất cả phòng ban đều có quyền tra cứu tài liệu này
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleStartBatchUpload}
                disabled={files.length === 0}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {files.length > 0
                    ? `Bắt Đầu Lập Chỉ Mục Tự Động: ${files.length} Tài Liệu`
                    : 'Vui Lòng Chọn Tệp Để Lập Chỉ Mục'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Multi-file Ingestion Progress */
          <div className="py-4 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Đang Xử Lý Pipeline Lập Chỉ Mục Hàng Loạt
              </h4>
              <p className="text-xs text-indigo-600 font-semibold">
                Đã xử lý {processedCount} / {files.length} tài liệu
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((processedCount / files.length) * 100)}%` }}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                <span className="font-bold">ĐANG THỰC HIỆN:</span>
              </div>
              <div className="text-slate-300 break-words">{currentStepName}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
