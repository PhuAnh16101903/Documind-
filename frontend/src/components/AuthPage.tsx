import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Sun,
  Moon,
  X,
  Music,
  Gift,
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      department_name: selectedDept.name,
      department_code: selectedDept.code,
      security_level: 'LEVEL_1_STAFF',
      token: `jwt-auth-token-${selectedDept.code.toLowerCase()}-${Date.now()}`,
      password: regPassword,
    };

    onRegisterUser(newUser);
    setRegSuccess(
      lang === 'vi'
        ? 'Đăng ký thành công! Đang tự động chuyển vào không gian làm việc...'
        : 'Registered successfully! Entering workspace...'
    );

    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 900);
  };

  const isLight = themeMode === 'light';

  return (
    <div
      className={`min-h-screen w-screen flex flex-col font-sans relative overflow-hidden select-none transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-[#fff1f2] via-[#fef3c7]/75 via-[#ffe4e6]/70 to-[#fed7aa]/60 text-slate-900'
          : 'bg-gradient-to-br from-[#1c060d] via-[#240d16] via-[#16060c] to-[#0a0f1d] text-slate-100'
      }`}
    >
      {/* Warm Ambient Radiance & Sunset Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-rose-400/25 dark:bg-rose-600/15 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[460px] h-[460px] rounded-full bg-amber-400/30 dark:bg-amber-600/15 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-red-500/10 dark:bg-red-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Decorative Blooming Hoa Đào (Left) & Hoa Mai (Right) Branches + Couplets */}
      <TetFloralBorders />

      {/* Falling Hoa Mai (Apricot) and Hoa Đào (Peach) Blossom Petals + Firework Sparks */}
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

          {/* Đăng Nhập Button */}
          <button
            onClick={() => {
              setAuthTab('login');
              setIsAuthModalOpen(true);
            }}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🧧</span>
            <span>{t.loginTab}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between relative z-10 px-6 sm:px-12 lg:px-16 xl:px-20 pb-16 gap-8">
        {/* Left Side: Hero Content */}
        <main className="max-w-xl xl:max-w-2xl space-y-6">
          {/* Festive Holiday Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/90 dark:bg-red-950/70 border border-red-300/80 dark:border-red-800 text-xs font-extrabold text-red-700 dark:text-red-300 shadow-xs">
            <span className="animate-spin" style={{ animationDuration: '8s' }}>🌸</span>
            <span>{t.tetGreeting}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">★</span>
            <span>Xuân Bính Ngọ Rạng Rỡ</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            {t.heroLine1}<br />
            {t.heroLine2}<br />
            {t.heroLine3}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
            {t.heroDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {/* Primary Action Button */}
            <button
              onClick={() => {
                setAuthTab('login');
                setIsAuthModalOpen(true);
              }}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#c51c16] to-[#e11d48] hover:from-[#a91712] hover:to-[#be123c] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-red-900/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t.heroExploreBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Register Button */}
            <button
              onClick={() => {
                setAuthTab('register');
                setIsAuthModalOpen(true);
              }}
              className="h-12 px-5 rounded-2xl bg-white/85 dark:bg-slate-900/85 hover:bg-white text-slate-900 dark:text-white font-semibold text-xs border border-slate-300/80 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <span>{t.heroRegisterBtn}</span>
            </button>
          </div>
        </main>

        {/* Right Side: Animated Tết Activities Showcase (Múa Lân, Nấu Bánh Chưng, Nhận Lì Xì) */}
        <aside
          aria-label="Hoạt Họa Tết 2026"
          className="flex flex-col items-center pointer-events-auto w-full max-w-[440px] xl:max-w-[480px] flex-shrink-0"
        >
          <TetActivityAnimation
            onOpenLogin={() => {
              setAuthTab('login');
              setIsAuthModalOpen(true);
            }}
          />

          {/* Minimalist Poetic Couplet */}
          <div className="mt-3 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-300/50 dark:border-amber-500/30 shadow-xs text-center">
            <span className="text-xs font-bold text-red-700 dark:text-red-400">
              🌸 Vạn Sự Như Ý • An Khang Thịnh Vượng • Tấn Tài Tấn Lộc 🌸
            </span>
          </div>
        </aside>
      </div>

      {/* TET HOLIDAY BACKGROUND MUSIC PLAYER (SLEEK, MINIMAL, NO LOOP) */}
      <TetMusicPlayer lang={lang} />

      {/* AUTHENTICATION MODAL (LOGIN & REGISTER) */}
      {isAuthModalOpen && (
        <div
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {authTab === 'login' ? t.loginTab : t.registerTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {t.loginSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs font-semibold">
              <button
                onClick={() => {
                  setAuthTab('login');
                  setLoginError('');
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authTab === 'login'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.loginTab}</span>
              </button>
              <button
                onClick={() => {
                  setAuthTab('register');
                  setRegError('');
                  setRegSuccess('');
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authTab === 'register'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-purple-500" />
                <span>{t.registerTab}</span>
              </button>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.loginEmailLabel}
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@documind.internal"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 font-semibold">
                      {t.loginPasswordLabel}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">password123</span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-9 pr-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  <span>{t.loginButton}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Quick Demo Pickers */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>{t.quickDemoTitle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectQuickDemo(u)}
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-all group"
                      >
                        <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 text-[11px] truncate">
                          {u.full_name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          {u.role === 'ADMIN' ? 'Admin' : u.department_code}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}
                {regSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Hoàng Tuấn Kiệt"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.corporateEmailLabel}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tuankiet@documind.internal"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    {t.regDeptLabel}
                  </label>
                  <select
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(Number(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
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
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                      {t.loginPasswordLabel}
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                      {t.regPasswordConfirm}
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-all mt-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.regSubmitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
