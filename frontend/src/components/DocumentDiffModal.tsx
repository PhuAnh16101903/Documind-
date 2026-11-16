import React, { useState } from 'react';
import { X, GitCompare, ArrowRight, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';

interface DocumentDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentDiffModal: React.FC<DocumentDiffModalProps> = ({ isOpen, onClose }) => {
  const [selectedDocId, setSelectedDocId] = useState(2); // Default to Travel Expense Policy v1 vs v2

  if (!isOpen) return null;

  const diffData = {
    documentTitle: 'Quy Định Hạn Mức Công Tác Phí & Tiếp Khách',
    v1: {
      version: 'v1.0 (Năm 2025)',
      status: 'ĐÃ HẾT HIỆU LỰC (SUPERSEDED)',
      date: '01/01/2025',
      clauses: [
        {
          heading: 'Điều 3. Hạn mức tiền phòng khách sạn',
          content: 'Cán bộ nhân viên đi công tác tại các thành phố trực thuộc Trung ương được thanh toán tiền thuê phòng nghỉ tối đa 800.000 VNĐ/phòng/đêm theo hóa đơn thực tế.',
          change: 'MODIFIED',
        },
        {
          heading: 'Điều 5. Phương tiện di chuyển máy bay',
          content: 'Chỉ áp dụng vé máy bay hạng phổ thông cho cán bộ cấp Trưởng phòng trở lên đối với các chặng bay trên 500km.',
          change: 'MODIFIED',
        },
        {
          heading: 'Điều 7. Chi phí tiếp khách nội bộ',
          content: 'Hạn mức tiếp khách nội bộ định kỳ hàng quý không vượt quá 500.000 VNĐ/người/quý.',
          change: 'REMOVED',
        },
      ],
    },
    v2: {
      version: 'v2.0 (Năm 2026 - Hiện hành)',
      status: 'ĐANG ÁP DỤNG (APPROVED)',
      date: '15/01/2026',
      clauses: [
        {
          heading: 'Điều 3. Hạn mức tiền phòng khách sạn',
          content: 'Cán bộ nhân viên đi công tác tại Hà Nội, TP.HCM và Đà Nẵng được áp dụng mức trần thanh toán tối đa 1.200.000 VNĐ/phòng/đêm theo hóa đơn VAT hợp lệ.',
          change: 'MODIFIED',
        },
        {
          heading: 'Điều 5. Phương tiện di chuyển máy bay',
          content: 'Toàn bộ CBNV đi công tác chặng bay trên 400km hoặc thời gian di chuyển đường bộ > 6 tiếng đều được thanh toán vé máy bay hạng phổ thông.',
          change: 'MODIFIED',
        },
        {
          heading: 'Điều 8. Chính sách làm việc từ xa kết hợp công tác (Bleisure)',
          content: '[ĐIỀU KHOẢN MỚI BỔ SUNG]: CBNV được phép kết hợp làm việc từ xa tối đa 02 ngày liền kề chuyến công tác nếu được Trưởng bộ phận phê duyệt trước.',
          change: 'ADDED',
        },
      ],
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-5xl h-[88vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <GitCompare className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">So Sánh Phiên Bản Văn Bản (Diff &amp; Audit)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  Version Drift Prevention
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{diffData.documentTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Đang xuất biên bản so sánh phiên bản sang PDF...')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-200 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Biên Bản Diff</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="h-10 border-b border-slate-200 px-6 bg-slate-50 flex items-center justify-between text-xs font-mono text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-400" />
              <span>Nội dung đã bãi bỏ / Thay đổi (v1.0)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-400" />
              <span>Quy định mới bổ sung / Cập nhật (v2.0)</span>
            </span>
          </div>
          <span className="text-emerald-700 font-medium">Tự động đối chiếu theo điều khoản</span>
        </div>

        {/* Diff Split Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-y-auto">
          {/* Column Left: Old Version v1.0 */}
          <div className="p-6 space-y-4 bg-slate-50/60">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{diffData.v1.version}</span>
                <span className="text-[10px] font-mono text-rose-700 font-bold">{diffData.v1.status}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">Ban hành: {diffData.v1.date}</div>
            </div>

            <div className="space-y-4">
              {diffData.v1.clauses.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2 text-xs"
                >
                  <div className="font-bold text-rose-800 flex items-center justify-between">
                    <span>{c.heading}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300 font-semibold">
                      {c.change === 'REMOVED' ? 'BÃI BỎ' : 'ĐÃ ĐỔI'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans line-through opacity-85">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column Right: Current Version v2.0 */}
          <div className="p-6 space-y-4 bg-white">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{diffData.v2.version}</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {diffData.v2.status}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">Ban hành: {diffData.v2.date}</div>
            </div>

            <div className="space-y-4">
              {diffData.v2.clauses.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2 text-xs"
                >
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>{c.heading}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold">
                      {c.change === 'ADDED' ? 'MỚI BỔ SUNG' : 'ĐIỀU CHỈNH TĂNG'}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-sans font-medium">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
