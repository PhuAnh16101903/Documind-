import React from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  Building,
  CheckCircle2,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { User } from '../types';
import { MockCorporateUsers } from '../services/api';

interface CorporateAuthModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export const CorporateAuthModal: React.FC<CorporateAuthModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const getSecurityBadge = (user: User) => {
    if (user.role === 'ADMIN') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-300 font-mono text-[10px] font-bold flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          <span>LEVEL 3 · ADMIN TOÀN QUYỀN</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>LEVEL 1 · RBAC PHÒNG BAN</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Xác Thực Định Danh Doanh Nghiệp
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Phân quyền bảo mật tự động dựa trên tài khoản đăng nhập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Session Overview */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
              Phiên Làm Việc Hiện Tại
            </span>
            {getSecurityBadge(currentUser)}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center shadow-sm text-sm">
              {currentUser.full_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-sm truncate">
                {currentUser.full_name}
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{currentUser.department_name || 'Hội đồng Quản trị / Quản trị viên'}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
            <span className="text-slate-400">Security Token:</span>
            <span className="text-indigo-600 font-bold truncate max-w-[280px]">
              {currentUser.token || 'jwt-bearer-token-authenticated'}
            </span>
          </div>
        </div>

        {/* Switch Corporate Identity Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono text-slate-600 font-bold">
              ĐĂNG NHẬP VỚI DANH TÍNH DOANH NGHIỆP KHÁC
            </span>
            <span className="text-[10px] text-slate-400">Hệ thống tự động chuyển đổi phạm vi truy xuất</span>
          </div>

          <div className="space-y-2">
            {MockCorporateUsers.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    if (u.token) localStorage.setItem('documind_token', u.token);
                    onSelectUser(u);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {u.full_name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {u.full_name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                            Đang hoạt động
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {u.department_name} • <span className="font-mono text-[10px]">{u.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Nguyên tắc Zero-Trust:</strong> Khi chuyển đổi tài khoản, quyền xem tài liệu trong
            Kho Tri Thức và phạm vi trả lời của AI Copilot sẽ tự động điều chỉnh theo đúng quyền hạn
            phòng ban của tài khoản đó. Mọi nỗ lực truy cập vượt quyền sẽ bị ghi nhận vào Audit Log.
          </div>
        </div>
      </div>
    </div>
  );
};
