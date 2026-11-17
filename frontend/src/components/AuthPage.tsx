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
  Menu,
} from 'lucide-react';
import { Department, User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  departments: Department[];
  availableUsers: User[];
  onRegisterUser: (newUser: User) => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSearch?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  departments,
  availableUsers,
  onRegisterUser,
  themeMode = 'light',
  onToggleTheme,
  onOpenSearch,
}) => {
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

  // Canvas ref for animated aquatic cube and swimming golden fish
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Swimming golden fish models
    interface Fish {
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      size: number;
      angle: number;
      tailAngle: number;
      tailSpeed: number;
      color: string;
    }

    const fishes: Fish[] = [
      { x: width * 0.75, y: height * 0.35, speedX: -0.85, speedY: 0.25, size: 28, angle: 0, tailAngle: 0, tailSpeed: 0.15, color: '#f59e0b' },
      { x: width * 0.82, y: height * 0.48, speedX: -0.65, speedY: -0.2, size: 22, angle: 0, tailAngle: 0, tailSpeed: 0.18, color: '#fbbf24' },
      { x: width * 0.68, y: height * 0.65, speedX: 0.75, speedY: 0.15, size: 24, angle: 0, tailAngle: 0, tailSpeed: 0.14, color: '#ea580c' },
      { x: width * 0.88, y: height * 0.25, speedX: -0.5, speedY: 0.3, size: 18, angle: 0, tailAngle: 0, tailSpeed: 0.2, color: '#fcd34d' },
    ];

    // Ambient floating bubbles
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }

    const bubbles: Bubble[] = Array.from({ length: 25 }, () => ({
      x: width * 0.5 + Math.random() * (width * 0.5),
      y: Math.random() * height,
      radius: 1.5 + Math.random() * 3.5,
      speed: 0.3 + Math.random() * 0.7,
      opacity: 0.2 + Math.random() * 0.5,
    }));

    let step = 0;

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw 3D Water Cube Perspective
      const cubeX = width * 0.75;
      const cubeY = height * 0.45;
      const cubeW = Math.min(width * 0.45, 480);
      const cubeH = Math.min(height * 0.65, 540);

      // Volumetric Sunbeams piercing through water cube
      ctx.save();
      const beamGrad = ctx.createLinearGradient(cubeX, cubeY - cubeH * 0.5, cubeX - 180, cubeY + cubeH * 0.8);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      beamGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.25)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(cubeX + 60 + Math.sin(step * 0.02) * 20, 0);
      ctx.lineTo(cubeX + 180 + Math.cos(step * 0.02) * 25, 0);
      ctx.lineTo(cubeX - 40, height);
      ctx.lineTo(cubeX - 160, height);
      ctx.closePath();
      ctx.fill();

      // Second soft sunbeam
      const beamGrad2 = ctx.createLinearGradient(cubeX + 100, 0, cubeX, height);
      beamGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      beamGrad2.addColorStop(0.5, 'rgba(147, 197, 253, 0.15)');
      beamGrad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad2;
      ctx.beginPath();
      ctx.moveTo(cubeX + 180, 0);
      ctx.lineTo(cubeX + 280, 0);
      ctx.lineTo(cubeX + 90, height);
      ctx.lineTo(cubeX - 10, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Draw 3D Floating Glass Cube Top & Faces
      ctx.save();
      const topOffset = Math.sin(step * 0.02) * 8;
      const cubeTopY = cubeY - cubeH * 0.42 + topOffset;

      // Isometric Top Lid of Cube
      ctx.beginPath();
      ctx.moveTo(cubeX, cubeTopY - 70);
      ctx.lineTo(cubeX + cubeW * 0.45, cubeTopY - 20);
      ctx.lineTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX - cubeW * 0.45, cubeTopY - 20);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glass Cube Left Face
      ctx.beginPath();
      ctx.moveTo(cubeX - cubeW * 0.45, cubeTopY - 20);
      ctx.lineTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX, cubeTopY + cubeH * 0.65);
      ctx.lineTo(cubeX - cubeW * 0.45, cubeTopY + cubeH * 0.65 - 50);
      ctx.closePath();
      const leftFaceGrad = ctx.createLinearGradient(cubeX - cubeW * 0.45, cubeTopY, cubeX, cubeTopY + cubeH * 0.65);
      leftFaceGrad.addColorStop(0, 'rgba(186, 230, 253, 0.25)');
      leftFaceGrad.addColorStop(1, 'rgba(147, 197, 253, 0.08)');
      ctx.fillStyle = leftFaceGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.stroke();

      // Glass Cube Right Face
      ctx.beginPath();
      ctx.moveTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX + cubeW * 0.45, cubeTopY - 20);
      ctx.lineTo(cubeX + cubeW * 0.45, cubeTopY + cubeH * 0.65 - 50);
      ctx.lineTo(cubeX, cubeTopY + cubeH * 0.65);
      ctx.closePath();
      const rightFaceGrad = ctx.createLinearGradient(cubeX, cubeTopY, cubeX + cubeW * 0.45, cubeTopY + cubeH * 0.65);
      rightFaceGrad.addColorStop(0, 'rgba(224, 242, 254, 0.3)');
      rightFaceGrad.addColorStop(1, 'rgba(125, 211, 252, 0.12)');
      ctx.fillStyle = rightFaceGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.stroke();
      ctx.restore();

      // 3. Draw Floating Bubbles inside water
      ctx.save();
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(step * 0.03 + b.y * 0.05) * 0.3;
        if (b.y < cubeTopY - 60) {
          b.y = cubeTopY + cubeH * 0.6;
          b.x = cubeX - cubeW * 0.35 + Math.random() * (cubeW * 0.7);
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.6})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      ctx.restore();

      // 4. Draw Swimming Golden Koi Fishes
      ctx.save();
      fishes.forEach((f) => {
        f.x += f.speedX;
        f.y += f.speedY;
        f.tailAngle += f.tailSpeed;

        // Contain fish within cube boundaries
        const minX = cubeX - cubeW * 0.35;
        const maxX = cubeX + cubeW * 0.35;
        const minY = cubeTopY + 20;
        const maxY = cubeTopY + cubeH * 0.55;

        if (f.x < minX || f.x > maxX) {
          f.speedX = -f.speedX;
        }
        if (f.y < minY || f.y > maxY) {
          f.speedY = -f.speedY;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        const facing = f.speedX > 0 ? 1 : -1;
        ctx.scale(facing, 1);

        // Fish Body (Golden Oval with organic taper)
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size, f.size * 0.45, 0, 0, Math.PI * 2);
        const fishGrad = ctx.createLinearGradient(-f.size, 0, f.size, 0);
        fishGrad.addColorStop(0, f.color);
        fishGrad.addColorStop(0.5, '#f59e0b');
        fishGrad.addColorStop(1, '#ef4444');
        ctx.fillStyle = fishGrad;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
        ctx.shadowBlur = 12;
        ctx.fill();

        // Fish Tail with wave oscillation
        const tailOffset = Math.sin(f.tailAngle) * 6;
        ctx.beginPath();
        ctx.moveTo(-f.size * 0.8, 0);
        ctx.quadraticCurveTo(-f.size * 1.3, tailOffset - 8, -f.size * 1.6, tailOffset - 12);
        ctx.lineTo(-f.size * 1.4, tailOffset);
        ctx.lineTo(-f.size * 1.6, tailOffset + 12);
        ctx.quadraticCurveTo(-f.size * 1.3, tailOffset + 8, -f.size * 0.8, 0);
        ctx.closePath();
        ctx.fillStyle = f.color;
        ctx.fill();

        // Fish Fin
        ctx.beginPath();
        ctx.ellipse(-f.size * 0.2, f.size * 0.25, f.size * 0.35, f.size * 0.15, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(254, 215, 170, 0.8)';
        ctx.fill();

        // Little Fish Eye
        ctx.beginPath();
        ctx.arc(f.size * 0.65, -f.size * 0.1, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(f.size * 0.68, -f.size * 0.1, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      setLoginError('Email hoặc tài khoản không tồn tại trong hệ thống doanh nghiệp.');
      return;
    }

    if (user.password && loginPassword && user.password !== loginPassword) {
      setLoginError('Mật khẩu không chính xác. Mật khẩu mặc định là: password123');
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
      setRegError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    const emailTrimmed = regEmail.trim().toLowerCase();
    if (availableUsers.some((u) => u.email.toLowerCase() === emailTrimmed)) {
      setRegError('Email này đã được đăng ký trong hệ thống.');
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
    setRegSuccess('Đăng ký thành công! Hệ thống đang tự động đăng nhập theo phòng ban của bạn...');

    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 900);
  };

  const isLight = themeMode === 'light';

  return (
    <div
      className={`min-h-screen w-screen flex flex-col font-sans relative overflow-hidden select-none transition-colors duration-300 ${
        isLight
          ? 'bg-[#d8e7f3] text-slate-800'
          : 'bg-[#060c18] text-slate-100'
      }`}
    >
      {/* Dynamic Animated Canvas for 3D Aquatic Cube & Swimming Fishes (Reference Image 2) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-90"
      />

      {/* Top Header Bar matching Reference Image 2 */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between z-20 relative">
        {/* Brand & Round Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-indigo-600 overflow-hidden">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
            DocuMind Enterprise
          </div>
        </div>

        {/* Right Tools (Language VI, Theme Toggle ☀️, Menu) */}
        <div className="flex items-center space-x-2.5">
          {/* Language VI Button */}
          <button
            type="button"
            className="h-9 px-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs hover:bg-white transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>VI</span>
          </button>

          {/* Dark / Light Mode Toggle ☀️ */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="h-9 w-9 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-white transition-all"
              title={isLight ? 'Chuyển sang Giao diện Tối' : 'Chuyển sang Giao diện Sáng'}
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
            className="h-9 px-4 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white hover:bg-white flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>Đăng Nhập</span>
          </button>
        </div>
      </header>

      {/* Hero Content matching Reference Image 2 Typography & Layout */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-14 lg:px-20 max-w-4xl z-10 relative pb-16">
        <div className="space-y-6">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide font-sans">
            Hệ thống tri thức AI dành cho doanh nghiệp
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Tra cứu quy chế.<br />
            So khớp điều khoản.<br />
            Đối chiếu nguồn.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
            Đối chiếu văn bản trong kho tri thức với vị trí bạn muốn tra cứu.
            Tìm quy định còn thiếu và kiểm chứng nguồn theo chuẩn Zero-Trust RBAC.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            {/* Primary Action Button (Red pill matching Image 2) */}
            <button
              onClick={() => {
                setAuthTab('login');
                setIsAuthModalOpen(true);
              }}
              className="h-12 px-6 rounded-2xl bg-[#c51c16] hover:bg-[#a91712] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
            >
              <span>Khám phá công cụ và cách sử dụng</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Register Button */}
            <button
              onClick={() => {
                setAuthTab('register');
                setIsAuthModalOpen(true);
              }}
              className="h-12 px-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white text-slate-900 dark:text-white font-semibold text-xs border border-slate-300/80 dark:border-slate-700 shadow-sm transition-all"
            >
              <span>Đăng Ký Nhân Viên Mới</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Bottom-Right Shortcut "Đi đến... Ctrl / ⌘ K" matching Reference Image 1 & 2 */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={onOpenSearch || (() => setIsAuthModalOpen(true))}
          className="h-10 px-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-750 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-lg hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Đi đến...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            Ctrl / ⌘ K
          </kbd>
        </button>
      </div>

      {/* AUTHENTICATION MODAL (LOGIN & REGISTER) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {authTab === 'login' ? 'Đăng Nhập Doanh Nghiệp' : 'Đăng Ký Nhân Viên Mới'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Hệ thống tự động phân quyền theo chức vụ đã lưu
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
                <span>Đăng Nhập</span>
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
                <span>Đăng Ký Mới</span>
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
                    EMAIL / TÊN ĐĂNG NHẬP
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
                      MẬT KHẨU
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Pass: password123</span>
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
                  <span>Xác Thực &amp; Vào Không Gian Làm Việc</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Quick Demo Pickers */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>TÀI KHOẢN MẪU PHÂN QUYỀN (NHẤP ĐỂ ĐIỀN):</span>
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
                          {u.role === 'ADMIN' ? '👑 Admin' : u.department_code}
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
                    HỌ VÀ TÊN
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                    EMAIL DOANH NGHIỆP
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
                    PHÒNG BAN (TỰ ĐỘNG PHÂN QUYỀN RBAC)
                  </label>
                  <select
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(Number(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                      MẬT KHẨU
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
                      XÁC NHẬN
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
                  <span>Đăng Ký &amp; Nhận Phân Quyền Phòng Ban</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
