import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Key,
  Sliders,
  Bell,
  LogOut,
  Save,
  Check,
  Building,
} from 'lucide-react';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onLogout: () => void;
  onUpdateUser: (updated: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogout,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'ai'>('profile');
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [strictGrounding, setStrictGrounding] = useState(true);
  const [zeroTrustScope, setZeroTrustScope] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      full_name: fullName,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Settings className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cài Đặt Hệ Thống &amp; Tài Khoản</h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {currentUser.full_name} · {currentUser.department_name || 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Thông Tin Cá Nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Phân Quyền &amp; Token</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-2.5 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Cấu Hình AI Retrieval</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1 bg-white">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                  HỌ VÀ TÊN
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                  EMAIL DOANH NGHIỆP (CỐ ĐỊNH THEO SSO)
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full h-10 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    PHÒNG BAN
                  </label>
                  <div className="h-10 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.department_name || 'Hội đồng Quản trị'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    CẤP BẬC PHÂN QUYỀN
                  </label>
                  <div className="h-10 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 font-mono">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-bold text-indigo-700">{currentUser.role}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm text-xs transition-all"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Đã Lưu Thay Đổi!' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & TOKEN */}
          {activeTab === 'security' && (
            <div className="space-y-3.5 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                  MÃ XÁC THỰC PHIÊN LÀM VIỆC (JWT BEARER TOKEN)
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 text-[11px] break-all select-all font-mono">
                  {currentUser.token || 'jwt-bearer-token-authenticated-2026'}
                </div>
                <p className="text-[10px] text-slate-500 font-sans">
                  Token này mang các claims mã hóa quyền hạn phòng ban và định tuyến dữ liệu tự động.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5 text-indigo-900 font-sans">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Tiêu Chuẩn Bảo Mật Zero-Trust</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Hệ thống không chia sẻ tài liệu giữa các phòng ban nếu không có cờ công khai (Public).
                  Các truy vấn vượt quyền sẽ tự động kích hoạt mã sự kiện 403 và ghi nhật ký kiểm toán.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AI RETRIEVAL CONFIG */}
          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">Bắt buộc trích dẫn có kiểm chứng (Strict Grounding)</div>
                  <div className="text-[10px] text-slate-500">
                    AI chỉ trả lời khi có điều khoản cụ thể, triệt tiêu 100% ảo giác (Anti-Hallucination)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={strictGrounding}
                  onChange={(e) => setStrictGrounding(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">Ranh giới phòng ban tự động (Zero-Trust Guardrail)</div>
                  <div className="text-[10px] text-slate-500">
                    Tự động chặn câu hỏi về bí mật phòng ban khác ngay ở lớp xử lý prompt
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={zeroTrustScope}
                  onChange={(e) => setZeroTrustScope(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer with Logout action */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất Khỏi Hệ Thống</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
