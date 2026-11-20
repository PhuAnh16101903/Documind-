import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Building,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  CheckCircle2,
  Save,
  LogOut,
  Check,
  BadgeCheck,
} from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../services/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onLogout: () => void;
  onUpdateUser: (updated: User) => void;
  lang?: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogout,
  onUpdateUser,
  lang = 'vi',
}) => {
  const t = translations[lang];
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState('0982 456 789');
  const [jobTitle, setJobTitle] = useState(
    currentUser.role === 'ADMIN'
      ? lang === 'vi' ? 'Kiến trúc sư hệ thống cấp cao' : 'Lead System Architect'
      : lang === 'vi' ? 'Chuyên viên quản lý tri thức' : 'Knowledge Operations Specialist'
  );
  const [workplace, setWorkplace] = useState(
    lang === 'vi' ? 'Tòa nhà điều hành Hà Nội' : 'Hanoi Headquarters Tower'
  );
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => localStorage.getItem('documind_gemini_key') || ''
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiApiKey.trim()) {
      localStorage.setItem('documind_gemini_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('documind_gemini_key');
    }
    onUpdateUser({
      ...currentUser,
      full_name: fullName,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const employeeCode = `EMP-2026-0${currentUser.id}84`;
  const joinDate = '15/01/2024';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066cc] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {currentUser.full_name ? currentUser.full_name[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.settingsTitle}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <BadgeCheck className="w-3 h-3 text-emerald-500" />
                  <span>{t.accountActiveVal}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser.department_name || (lang === 'vi' ? 'Hội đồng Quản trị' : 'Board of Directors')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detailed Personal Information Body */}
        <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.fullNameLabel}
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium transition-colors"
                  required
                />
              </div>
            </div>

            {/* Corporate Email */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.corporateEmailLabel}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 text-xs text-slate-500 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.employeeIdLabel}
              </label>
              <div className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300 font-mono flex items-center font-bold">
                {employeeCode}
              </div>
            </div>

            {/* Assigned Department */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.departmentLabel}
              </label>
              <div className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">
                  {lang === 'en' && currentUser.department_name_en
                    ? currentUser.department_name_en
                    : currentUser.department_name
                    ? currentUser.department_name.replace(/\s*\(.*?\)\s*/g, '')
                    : (lang === 'vi' ? 'Hội đồng Quản trị' : 'Executive Board')}
                </span>
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.jobTitleLabel}
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.phoneLabel}
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.joinDateLabel}
              </label>
              <div className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300 font-mono flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{joinDate}</span>
              </div>
            </div>

            {/* Workplace Location */}
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                {t.workplaceLabel}
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Security Clearance Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-slate-950 border border-indigo-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>{t.securityClearanceLabel}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {currentUser.role === 'ADMIN'
                  ? lang === 'vi' ? 'Cấp 3 Toàn quyền truy xuất' : 'Clearance Level 3 Full Unrestricted Access'
                  : lang === 'vi' ? `Cấp 1 Phân quyền phòng ban ${currentUser.department_code || ''}` : `Clearance Level 1 Department Access ${currentUser.department_code || ''}`}
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-xs">
              {currentUser.role === 'ADMIN' ? 'LEVEL 3' : 'LEVEL 1'}
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? t.savedSuccess : t.saveChanges}</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logoutButton}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            {t.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};
