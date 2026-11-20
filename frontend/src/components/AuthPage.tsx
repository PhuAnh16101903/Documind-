import React, { useState, useEffect } from 'react';
import {
  Brain,
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Sun,
  Moon,
  FileText,
  Check,
} from 'lucide-react';
import { Department, User } from '../types';
import { Language, translations } from '../services/i18n';
import { TetBlossomCanvas } from './TetBlossomCanvas';
import { TetLanterns } from './TetLanterns';
import { TetMusicPlayer } from './TetMusicPlayer';
import { TetActivityAnimation } from './TetActivityAnimation';
import { TetFloralBorders } from './TetFloralBorders';
import { Brand } from './Brand';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  departments: Department[];
  availableUsers: User[];
  onRegisterUser: (newUser: User) => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSearch?: () => void;
  lang?: Language;
  onToggleLang?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  departments,
  availableUsers,
  onRegisterUser,
  themeMode = 'light',
  onToggleTheme,
  lang = 'vi',
  onToggleLang,
}) => {
  const t = translations[lang];

  // View state: 'landing' for public hero view, 'auth' for dedicated full-page authentication view
  const [viewMode, setViewMode] = useState<'landing' | 'auth'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#login' || hash === '#register' || hash === '#auth') {
        return 'auth';
      }
    }
    return 'landing';
  });

  const [authTab, setAuthTab] = useState<'login' | 'register'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#register') {
      return 'register';
    }
    return 'login';
  });

  // Listen to browser hash changes so Back / Forward buttons work seamlessly
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setViewMode('auth');
        setAuthTab('login');
      } else if (hash === '#register') {
        setViewMode('auth');
        setAuthTab('register');
      } else if (hash === '#home' || hash === '' || hash === '#landing') {
        setViewMode('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToAuth = (mode: 'login' | 'register') => {
    setAuthTab(mode);
    setViewMode('auth');
    window.location.hash = `#${mode}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    setViewMode('landing');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDeptId, setRegDeptId] = useState<number>(departments[0]?.id || 1);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const user = availableUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmedEmail ||
        u.username.toLowerCase() === trimmedEmail
    );

    if (!user) {
      setLoginError(
        lang === 'vi'
          ? 'Email hoặc tài khoản không tồn tại trong hệ thống doanh nghiệp.'
          : 'Corporate account not found in system.'
      );
      return;
    }

    if (user.password && loginPassword && user.password !== loginPassword) {
      setLoginError(
        lang === 'vi'
          ? 'Mật khẩu không chính xác. Mật khẩu mẫu là password123'
          : 'Incorrect password. Demo password is password123'
      );
      return;
    }

    if (user.token) {
      localStorage.setItem('documind_token', user.token);
    }
    window.location.hash = '';
    onLoginSuccess(user);
  };

  // Quick fill demo user
  const handleSelectQuickDemo = (user: User) => {
    setLoginEmail(user.email);
    setLoginPassword(user.password || 'password123');
    setLoginError('');
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setRegError(lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin.' : 'Please fill all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(lang === 'vi' ? 'Mật khẩu xác nhận không khớp.' : 'Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError(lang === 'vi' ? 'Mật khẩu phải có tối thiểu 6 ký tự.' : 'Password must be at least 6 characters.');
      return;
    }

    const emailTrimmed = regEmail.trim().toLowerCase();
    if (availableUsers.some((u) => u.email.toLowerCase() === emailTrimmed)) {
      setRegError(lang === 'vi' ? 'Email này đã tồn tại trong hệ thống.' : 'This email is already registered.');
      return;
    }

    const selectedDept = departments.find((d) => d.id === regDeptId) || departments[0];

    const newUser: User = {
      id: Date.now(),
      email: emailTrimmed,
      username: emailTrimmed.split('@')[0],
      full_name: regFullName.trim(),
      role: 'EMPLOYEE',
      department_id: selectedDept.id,
      department_name: selectedDept.name.replace(/\s*\(.*?\)\s*/g, ''),
      department_code: selectedDept.code,
      security_level: 'LEVEL_1_STAFF',
      token: `jwt-auth-token-${selectedDept.code.toLowerCase()}-${Date.now()}`,
      password: regPassword,
    };

    if (newUser.token) {
      localStorage.setItem('documind_token', newUser.token);
    }
    onRegisterUser(newUser);
    setRegSuccess(
      lang === 'vi'
        ? 'Đăng ký thành công! Đang tự động chuyển vào không gian làm việc...'
        : 'Registered successfully! Entering workspace...'
    );

    setTimeout(() => {
      window.location.hash = '';
      onLoginSuccess(newUser);
    }, 900);
  };

  const isLight = themeMode === 'light';

  // =========================================================================
  // VIEW MODE 1: DEDICATED FULL-PAGE AUTHENTICATION VIEW (SEPARATE PAGE)
  // =========================================================================
  if (viewMode === 'auth') {
    return (
      <div
        className={`min-h-screen w-screen flex flex-col font-sans relative overflow-x-hidden select-none transition-colors duration-300 ${
          isLight
            ? 'bg-gradient-to-br from-[#fff1f2] via-[#fef3c7]/75 via-[#ffe4e6]/70 to-[#fed7aa]/60 text-slate-900'
            : 'bg-gradient-to-br from-[#1c060d] via-[#240d16] via-[#16060c] to-[#0a0f1d] text-slate-100'
        }`}
      >
        {/* Warm Ambient Radiance Orbs */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-rose-400/25 dark:bg-rose-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full bg-amber-400/30 dark:bg-amber-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-500/10 dark:bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Traditional Vietnamese Bronze Drum (Trống Đồng Đông Sơn) Center Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] opacity-[0.06] dark:opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 500 500" fill="none" className="w-full h-full text-amber-700 dark:text-amber-400">
            <circle cx="250" cy="250" r="240" stroke="currentColor" strokeWidth="4" />
            <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="250" cy="250" r="190" stroke="currentColor" strokeWidth="3" />
            <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="250" cy="250" r="70" stroke="currentColor" strokeWidth="2" />
            {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180, 205.7, 231.4, 257.1, 282.8, 308.5, 334.2].map((deg, i) => (
              <polygon
                key={i}
                points="250,185 243,245 257,245"
                fill="currentColor"
                transform={`rotate(${deg} 250 250)`}
              />
            ))}
          </svg>
        </div>

        {/* Decorative Blooming Hoa Đào (Left) & Hoa Mai (Right) Branches + Couplets */}
        <TetFloralBorders showCouplets={true} />

        {/* Falling Petals & Sparks */}
        <TetBlossomCanvas variant="hero" />

        {/* Hanging Lanterns */}
        <TetLanterns />

        {/* Top Header Bar with Brand, Back Button, Language, Theme */}
        <header className="h-16 px-6 sm:px-12 flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-3 sm:gap-6">
            <Brand lang={lang} />
            {/* Back to Home Landing Page Button */}
            <button
              type="button"
              onClick={navigateToLanding}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:shadow transition-all group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
              <span>{lang === 'vi' ? 'Quay lại trang chủ' : 'Back to Home'}</span>
            </button>
          </div>

          {/* Right Tools (Language VI/EN, Theme Toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onToggleLang && (
              <button
                type="button"
                onClick={onToggleLang}
                className="h-9 px-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs hover:bg-white transition-all cursor-pointer"
                title={t.switchLang}
              >
                <Globe className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
                <span className="uppercase">{lang}</span>
              </button>
            )}

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="h-9 w-9 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-white transition-all cursor-pointer"
                title={isLight ? t.themeDark : t.themeLight}
              >
                {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            )}
          </div>
        </header>

        {/* Main Dedicated Authentication Card Stage */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-20 py-3 sm:py-6">
          <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-amber-300/70 dark:border-amber-500/50 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-3.5 sm:space-y-4 relative overflow-hidden transition-all">
            {/* Top Decorative Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-rose-600" />

            {/* Header Badge & Title */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-100/90 dark:bg-red-950/80 border border-red-300/80 dark:border-red-800 text-[10px] sm:text-[11px] font-extrabold text-red-700 dark:text-red-300 shadow-xs">
                <span>🧧</span>
                <span>Cổng Xác Thực Doanh Nghiệp NEU</span>
                <span className="text-amber-500">★</span>
                <span>Xuân Bính Ngọ 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {authTab === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản Mới'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-tight">
                {authTab === 'login'
                  ? 'Tra cứu văn bản pháp quy, đối chiếu điều khoản và trích dẫn chuẩn Zero-Trust'
                  : 'Tạo tài khoản nhân viên mới để tra cứu quy chế theo phân quyền bảo mật'}
              </p>
            </div>

            {/* Segmented Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setLoginError('');
                  window.location.hash = '#login';
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🧧</span>
                <span>{t.loginTab}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setRegError('');
                  setRegSuccess('');
                  window.location.hash = '#register';
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>✨</span>
                <span>{t.registerTab}</span>
              </button>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                {loginError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Quick 1-Click Demo Profiles */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    <span className="flex items-center gap-1">
                      <span>⚡</span>
                      <span>Chọn nhanh tài khoản mẫu:</span>
                    </span>
                    <span className="text-[10px] text-amber-600/80 dark:text-amber-400 font-mono">1-click test</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableUsers.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectQuickDemo(u)}
                        className={`p-1.5 px-2 rounded-lg border text-left transition-all group cursor-pointer ${
                          loginEmail === u.email
                            ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-600 shadow-xs'
                            : 'bg-white/90 dark:bg-slate-900/90 hover:bg-amber-50 dark:hover:bg-slate-800 border-amber-200/60 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-amber-400 text-[10.5px] truncate flex items-center justify-between">
                          <span>{u.full_name}</span>
                          {loginEmail === u.email && <Check className="w-3 h-3 text-red-600 dark:text-amber-400" />}
                        </div>
                        <div className="text-[9.5px] text-slate-500 font-mono truncate">
                          {u.role === 'ADMIN' ? 'Admin • CNTT' : u.department_code}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.loginEmailLabel}
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@documind.internal"
                      className="w-full h-9.5 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-amber-500 transition-colors font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 font-semibold">
                      {t.loginPasswordLabel}
                    </label>
                    <span className="text-[9.5px] text-slate-400 font-mono">Mật khẩu mẫu: password123</span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9.5 pl-9 pr-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-amber-500 transition-colors font-sans"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className="text-[10.5px] text-slate-600 dark:text-slate-300 font-sans">
                      Ghi nhớ phiên đăng nhập trên thiết bị này
                    </span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>🧧</span>
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Switch to Register */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('register');
                      window.location.hash = '#register';
                    }}
                    className="text-[11px] text-slate-500 hover:text-red-600 dark:hover:text-amber-400 font-semibold cursor-pointer transition-colors"
                  >
                    Chưa có tài khoản nhân viên? <span className="underline font-bold">Đăng ký mới tại đây</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                {regError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}
                {regSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Hoàng Tuấn Kiệt"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.corporateEmailLabel}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tuankiet@documind.internal"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.regDeptLabel}
                  </label>
                  <select
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(Number(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name.replace(/\s*\(.*?\)\s*/g, '')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                      {t.loginPasswordLabel}
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                      {t.regPasswordConfirm}
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Primary Register Submit Button */}
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95 transition-all mt-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hoàn Tất Đăng Ký & Nhận Quyền Truy Cập</span>
                </button>

                {/* Switch to Login */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      window.location.hash = '#login';
                    }}
                    className="text-[11px] text-slate-500 hover:text-red-600 dark:hover:text-amber-400 font-semibold cursor-pointer transition-colors"
                  >
                    Đã có tài khoản nhân viên? <span className="underline font-bold">Đăng nhập tại đây</span>
                  </button>
                </div>
              </form>
            )}

            {/* Security Clearance Badge */}
            <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-2.5 text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Zero-Trust ISO 27001</span>
              </span>
              <span>•</span>
              <span>Mã hóa phân quyền AES-256</span>
              <span>•</span>
              <span>Bản quyền © 2026 NEU</span>
            </div>
          </div>
        </main>

        {/* Headless Tết Music Player */}
        <TetMusicPlayer lang={lang} />
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: PUBLIC LANDING PAGE (WITH LUSH BLOSSOMS, VISIBLE COUPLETS,
  // TẾT 3D ACTIVITIES, BENTO METRICS BAR & BRONZE DRUM WATERMARK)
  // =========================================================================
  return (
    <div
      className={`min-h-screen w-screen flex flex-col font-sans relative overflow-x-hidden select-none transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-[#fff1f2] via-[#fef3c7]/75 via-[#ffe4e6]/70 to-[#fed7aa]/60 text-slate-900'
          : 'bg-gradient-to-br from-[#1c060d] via-[#240d16] via-[#16060c] to-[#0a0f1d] text-slate-100'
      }`}
    >
      {/* Warm Ambient Radiance & Sunset Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-rose-400/25 dark:bg-rose-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full bg-amber-400/30 dark:bg-amber-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[500px] bg-red-500/10 dark:bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Traditional Vietnamese Bronze Drum (Trống Đồng Đông Sơn) Center Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-[0.06] dark:opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full text-amber-700 dark:text-amber-400">
          <circle cx="250" cy="250" r="240" stroke="currentColor" strokeWidth="4" />
          <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="250" cy="250" r="190" stroke="currentColor" strokeWidth="3" />
          <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="250" cy="250" r="70" stroke="currentColor" strokeWidth="2" />
          {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180, 205.7, 231.4, 257.1, 282.8, 308.5, 334.2].map((deg, i) => (
            <polygon
              key={i}
              points="250,185 243,245 257,245"
              fill="currentColor"
              transform={`rotate(${deg} 250 250)`}
            />
          ))}
        </svg>
      </div>

      {/* Decorative Blooming Hoa Đào (Left) & Hoa Mai (Right) Branches + Couplets */}
      <TetFloralBorders showCouplets={true} />

      {/* Falling Hoa Mai and Hoa Đào Blossom Petals + Firework Sparks */}
      <TetBlossomCanvas variant="hero" />

      {/* Traditional Hanging Red Silk Lanterns with Golden Tassels */}
      <TetLanterns />

      {/* Top Header Bar matching neu_career_ai PublicHeader */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between z-20 relative">
        {/* Authentic Circular NEU Brand Emblem */}
        <Brand lang={lang} />

        {/* Right Tools (Language VI/EN, Theme Toggle ☀️, Sign In) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Toggle VI <-> EN */}
          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              className="h-9 px-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs hover:bg-white transition-all cursor-pointer"
              title={t.switchLang}
            >
              <Globe className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
              <span className="uppercase">{lang}</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle ☀️ */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="h-9 w-9 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-white transition-all cursor-pointer"
              title={isLight ? t.themeDark : t.themeLight}
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          )}

          {/* Đăng Nhập Button -> Navigates to dedicated auth page */}
          <button
            onClick={() => navigateToAuth('login')}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🧧</span>
            <span>{t.loginTab}</span>
          </button>
        </div>
      </header>

      {/* Main Container - Balanced horizontal padding prevents collision with couplets */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between relative z-10 pl-14 sm:pl-18 md:pl-22 lg:pl-24 xl:pl-28 pr-14 sm:pr-18 md:pr-22 lg:pr-24 xl:pr-28 pb-8 gap-8">
        {/* Left Side: Hero Content */}
        <main className="max-w-xl xl:max-w-2xl space-y-4 sm:space-y-5">
          {/* Festive Holiday Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/90 dark:bg-red-950/70 border border-red-300/80 dark:border-red-800 text-xs font-extrabold text-red-700 dark:text-red-300 shadow-xs">
            <span className="animate-spin" style={{ animationDuration: '8s' }}>🌸</span>
            <span>{t.tetGreeting}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">★</span>
            <span>Xuân Bính Ngọ Rạng Rỡ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            {t.heroLine1}<br />
            {t.heroLine2}<br />
            {t.heroLine3}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
            {t.heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-3.5">
            {/* Primary Action Button -> Go to Dedicated Login Page */}
            <button
              onClick={() => navigateToAuth('login')}
              className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-[#c51c16] to-[#e11d48] hover:from-[#a91712] hover:to-[#be123c] text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-red-900/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t.heroExploreBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Register Button -> Go to Dedicated Register Page */}
            <button
              onClick={() => navigateToAuth('register')}
              className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl bg-white/85 dark:bg-slate-900/85 hover:bg-white text-slate-900 dark:text-white font-semibold text-xs border border-slate-300/80 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <span>{t.heroRegisterBtn}</span>
            </button>
          </div>

          {/* Quick Metrics & Feature Highlights Bento Pill Bar (Fills empty spaces) */}
          <div className="pt-2 grid grid-cols-2 gap-2.5 max-w-xl">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/70 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <span className="text-sm sm:text-base">🏛️</span>
              <div>
                <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white">Đại Học Kinh Tế Quốc Dân</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-mono">Đơn vị nghiên cứu & chủ quản</div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/70 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <span className="text-sm sm:text-base">📚</span>
              <div>
                <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white">10,000+ Điều Khoản Quy Chế</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-mono">Số hóa toàn diện kho nội bộ</div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/70 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <span className="text-sm sm:text-base">⚡</span>
              <div>
                <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white">0.3s Trích Xuất Zero-Trust</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-mono">Đối chiếu nguồn minh bạch</div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/70 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <span className="text-sm sm:text-base">🧧</span>
              <div>
                <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white">Xuân Bính Ngọ 2026</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-mono">Vạn sự hanh thông cát tường</div>
              </div>
            </div>
          </div>

          {/* Seasonal Spring Motto Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300/40 text-[10px] sm:text-[11px] font-semibold text-amber-800 dark:text-amber-300">
            <span>🎋</span>
            <span>Khởi sắc tri thức số • Bứt phá thành công • Đón mừng năm mới 2026</span>
          </div>
        </main>

        {/* Right Side: Animated Tết Activities Showcase (Múa Lân, Nấu Bánh Chưng, Nhận Lì Xì) */}
        <aside
          aria-label="Hoạt Họa Tết 2026"
          className="flex flex-col items-center pointer-events-auto w-full max-w-[420px] xl:max-w-[460px] flex-shrink-0"
        >
          <TetActivityAnimation
            onOpenLogin={() => navigateToAuth('login')}
          />

          {/* Poetic Couplet Banner */}
          <div className="mt-2.5 px-4 py-1.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-amber-300/60 dark:border-amber-500/40 shadow-xs text-center">
            <span className="text-[11px] sm:text-xs font-bold text-red-700 dark:text-red-400">
              🌸 Vạn Sự Như Ý • An Khang Thịnh Vượng • Tấn Tài Tấn Lộc 🌸
            </span>
          </div>
        </aside>
      </div>

      {/* Decorative Bottom Footer Ribbon (Fills bottom empty space) */}
      <footer className="w-full py-2 px-6 text-center text-[10.5px] text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs border-t border-amber-200/40 dark:border-slate-800/60 z-20 relative">
        <span>🌸 Chúc Mừng Năm Mới 2026 • DocuMind Enterprise • Hệ Thống Quản Trị Tri Thức Quy Chế Nội Bộ • Trường Đại học Kinh tế Quốc dân 🌸</span>
      </footer>

      {/* TET HOLIDAY BACKGROUND MUSIC PLAYER (SLEEK, MINIMAL, NO LOOP) */}
      <TetMusicPlayer lang={lang} />
    </div>
  );
};
