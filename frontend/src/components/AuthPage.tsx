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
  const [themeScene, setThemeScene] = useState<'tet' | 'aquatic'>('tet');

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

  // Canvas ref for realistic aquatic 3D cube and swimming golden koi fishes
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

    // Realistic Swimming Golden Koi Fish model
    interface KoiFish {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      bodyWidth: number;
      angle: number;
      targetAngle: number;
      tailPhase: number;
      tailFreq: number;
      colorHead: string;
      colorBody: string;
      colorTail: string;
    }

    const fishes: KoiFish[] = [
      {
        x: width * 0.76,
        y: height * 0.38,
        vx: -0.9,
        vy: 0.25,
        length: 52,
        bodyWidth: 16,
        angle: Math.PI,
        targetAngle: Math.PI,
        tailPhase: 0,
        tailFreq: 0.14,
        colorHead: '#ea580c',
        colorBody: '#f59e0b',
        colorTail: '#fbbf24',
      },
      {
        x: width * 0.84,
        y: height * 0.52,
        vx: -0.7,
        vy: -0.2,
        length: 42,
        bodyWidth: 13,
        angle: Math.PI,
        targetAngle: Math.PI,
        tailPhase: 2.1,
        tailFreq: 0.16,
        colorHead: '#f97316',
        colorBody: '#fb923c',
        colorTail: '#fef08a',
      },
      {
        x: width * 0.68,
        y: height * 0.64,
        vx: 0.85,
        vy: 0.15,
        length: 46,
        bodyWidth: 14,
        angle: 0,
        targetAngle: 0,
        tailPhase: 4.2,
        tailFreq: 0.15,
        colorHead: '#dc2626',
        colorBody: '#f97316',
        colorTail: '#fde047',
      },
      {
        x: width * 0.88,
        y: height * 0.28,
        vx: -0.6,
        vy: 0.3,
        length: 36,
        bodyWidth: 11,
        angle: Math.PI,
        targetAngle: Math.PI,
        tailPhase: 1.2,
        tailFreq: 0.18,
        colorHead: '#f59e0b',
        colorBody: '#fbbf24',
        colorTail: '#fef9c3',
      },
    ];

    // Ambient floating water bubbles & light motes
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }

    const bubbles: Bubble[] = Array.from({ length: 28 }, () => ({
      x: width * 0.55 + Math.random() * (width * 0.4),
      y: Math.random() * height,
      radius: 1.5 + Math.random() * 3.5,
      speed: 0.3 + Math.random() * 0.65,
      opacity: 0.25 + Math.random() * 0.5,
    }));

    let step = 0;

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // 1. Perspective 3D Water Cube geometry
      const cubeX = width * 0.75;
      const cubeY = height * 0.46;
      const cubeW = Math.min(width * 0.44, 480);
      const cubeH = Math.min(height * 0.65, 540);

      // Volumetric sunlight beams piercing down through the glass cube
      ctx.save();
      const beamGrad = ctx.createLinearGradient(cubeX + 40, 0, cubeX - 150, height);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      beamGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.22)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(cubeX + 40 + Math.sin(step * 0.015) * 15, 0);
      ctx.lineTo(cubeX + 220 + Math.cos(step * 0.015) * 20, 0);
      ctx.lineTo(cubeX + 20, height);
      ctx.lineTo(cubeX - 140, height);
      ctx.closePath();
      ctx.fill();

      // Second soft sunbeam
      const beamGrad2 = ctx.createLinearGradient(cubeX + 160, 0, cubeX + 50, height);
      beamGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
      beamGrad2.addColorStop(0.5, 'rgba(147, 197, 253, 0.12)');
      beamGrad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad2;
      ctx.beginPath();
      ctx.moveTo(cubeX + 180, 0);
      ctx.lineTo(cubeX + 290, 0);
      ctx.lineTo(cubeX + 120, height);
      ctx.lineTo(cubeX + 10, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. 3D Floating Glass Aquarium Cube
      ctx.save();
      const topOffset = Math.sin(step * 0.02) * 8;
      const cubeTopY = cubeY - cubeH * 0.42 + topOffset;

      // Isometric Top Water Surface (Lid)
      ctx.beginPath();
      ctx.moveTo(cubeX, cubeTopY - 65);
      ctx.lineTo(cubeX + cubeW * 0.45, cubeTopY - 18);
      ctx.lineTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX - cubeW * 0.45, cubeTopY - 18);
      ctx.closePath();
      const topLidGrad = ctx.createLinearGradient(cubeX - cubeW * 0.45, cubeTopY - 65, cubeX + cubeW * 0.45, cubeTopY + 30);
      topLidGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      topLidGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.35)');
      topLidGrad.addColorStop(1, 'rgba(186, 230, 253, 0.25)');
      ctx.fillStyle = topLidGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Left Glass Face
      ctx.beginPath();
      ctx.moveTo(cubeX - cubeW * 0.45, cubeTopY - 18);
      ctx.lineTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX, cubeTopY + cubeH * 0.65);
      ctx.lineTo(cubeX - cubeW * 0.45, cubeTopY + cubeH * 0.65 - 48);
      ctx.closePath();
      const leftFaceGrad = ctx.createLinearGradient(cubeX - cubeW * 0.45, cubeTopY, cubeX, cubeTopY + cubeH * 0.65);
      leftFaceGrad.addColorStop(0, 'rgba(186, 230, 253, 0.28)');
      leftFaceGrad.addColorStop(0.6, 'rgba(147, 197, 253, 0.12)');
      leftFaceGrad.addColorStop(1, 'rgba(96, 165, 250, 0.06)');
      ctx.fillStyle = leftFaceGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Right Glass Face (Bright highlight)
      ctx.beginPath();
      ctx.moveTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX + cubeW * 0.45, cubeTopY - 18);
      ctx.lineTo(cubeX + cubeW * 0.45, cubeTopY + cubeH * 0.65 - 48);
      ctx.lineTo(cubeX, cubeTopY + cubeH * 0.65);
      ctx.closePath();
      const rightFaceGrad = ctx.createLinearGradient(cubeX, cubeTopY, cubeX + cubeW * 0.45, cubeTopY + cubeH * 0.65);
      rightFaceGrad.addColorStop(0, 'rgba(240, 249, 255, 0.35)');
      rightFaceGrad.addColorStop(0.7, 'rgba(186, 230, 253, 0.15)');
      rightFaceGrad.addColorStop(1, 'rgba(125, 211, 252, 0.08)');
      ctx.fillStyle = rightFaceGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glass Edge Shimmering Highlights
      ctx.beginPath();
      ctx.moveTo(cubeX, cubeTopY + 30);
      ctx.lineTo(cubeX, cubeTopY + cubeH * 0.65);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 3. Floating Caustic Bubbles
      ctx.save();
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(step * 0.025 + b.y * 0.03) * 0.25;
        if (b.y < cubeTopY - 50) {
          b.y = cubeTopY + cubeH * 0.6;
          b.x = cubeX - cubeW * 0.35 + Math.random() * (cubeW * 0.7);
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.5})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.9})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });
      ctx.restore();

      // 4. Draw Anatomically Realistic Swimming Golden Koi Fish
      ctx.save();
      fishes.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        f.tailPhase += f.tailFreq;

        const minX = cubeX - cubeW * 0.34;
        const maxX = cubeX + cubeW * 0.34;
        const minY = cubeTopY + 25;
        const maxY = cubeTopY + cubeH * 0.55;

        // Smooth turnaround when hitting boundaries
        if (f.x < minX && f.vx < 0) f.vx = Math.abs(f.vx);
        if (f.x > maxX && f.vx > 0) f.vx = -Math.abs(f.vx);
        if (f.y < minY && f.vy < 0) f.vy = Math.abs(f.vy);
        if (f.y > maxY && f.vy > 0) f.vy = -Math.abs(f.vy);

        f.targetAngle = Math.atan2(f.vy, f.vx);
        // Soft angular interpolation
        f.angle += (f.targetAngle - f.angle) * 0.05;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);

        const L = f.length;
        const W = f.bodyWidth;

        // Tail wave sinusoidal flutter
        const tailWave1 = Math.sin(f.tailPhase) * (W * 0.35);
        const tailWave2 = Math.sin(f.tailPhase - 0.7) * (W * 0.65);

        // Realistic Pectoral Fins (Left & Right)
        const finSway = Math.sin(f.tailPhase * 0.8) * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(L * 0.15, -W * 0.45);
        ctx.quadraticCurveTo(L * 0.1, -W * 1.35 + finSway * 5, -L * 0.1, -W * 1.15);
        ctx.quadraticCurveTo(0, -W * 0.55, L * 0.05, -W * 0.45);
        ctx.fillStyle = 'rgba(254, 215, 170, 0.65)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(L * 0.15, W * 0.45);
        ctx.quadraticCurveTo(L * 0.1, W * 1.35 - finSway * 5, -L * 0.1, W * 1.15);
        ctx.quadraticCurveTo(0, W * 0.55, L * 0.05, W * 0.45);
        ctx.fillStyle = 'rgba(254, 215, 170, 0.65)';
        ctx.fill();
        ctx.restore();

        // Realistic Koi Body (Fluid curved spine)
        ctx.beginPath();
        ctx.moveTo(L * 0.45, 0); // Head tip
        ctx.bezierCurveTo(L * 0.35, -W * 0.55, L * 0.05, -W * 0.6, -L * 0.2, -W * 0.35 + tailWave1 * 0.3);
        ctx.bezierCurveTo(-L * 0.4, -W * 0.2 + tailWave2 * 0.5, -L * 0.55, tailWave2 * 0.8, -L * 0.65, tailWave2); // Tail base
        ctx.bezierCurveTo(-L * 0.55, tailWave2 * 0.8, -L * 0.4, W * 0.2 + tailWave2 * 0.5, -L * 0.2, W * 0.35 + tailWave1 * 0.3);
        ctx.bezierCurveTo(L * 0.05, W * 0.6, L * 0.35, W * 0.55, L * 0.45, 0);
        ctx.closePath();

        const bodyGrad = ctx.createLinearGradient(-L * 0.6, 0, L * 0.45, 0);
        bodyGrad.addColorStop(0, f.colorTail);
        bodyGrad.addColorStop(0.4, f.colorBody);
        bodyGrad.addColorStop(0.85, f.colorHead);
        bodyGrad.addColorStop(1, '#ffffff');
        ctx.fillStyle = bodyGrad;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Dorsal fin along the back
        ctx.beginPath();
        ctx.moveTo(L * 0.1, 0);
        ctx.quadraticCurveTo(-L * 0.15, -W * 0.35, -L * 0.35, tailWave1 * 0.2);
        ctx.lineTo(-L * 0.3, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(251, 146, 60, 0.7)';
        ctx.fill();

        // Graceful Two-Lobed Caudal Tail Fin
        ctx.beginPath();
        ctx.moveTo(-L * 0.65, tailWave2);
        ctx.bezierCurveTo(-L * 0.85, tailWave2 - W * 0.9, -L * 1.15, tailWave2 - W * 1.3, -L * 1.25, tailWave2 - W * 0.8);
        ctx.quadraticCurveTo(-L * 0.95, tailWave2, -L * 1.25, tailWave2 + W * 0.8);
        ctx.bezierCurveTo(-L * 1.15, tailWave2 + W * 1.3, -L * 0.85, tailWave2 + W * 0.9, -L * 0.65, tailWave2);
        ctx.closePath();
        const tailGrad = ctx.createLinearGradient(-L * 1.25, 0, -L * 0.65, 0);
        tailGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
        tailGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.85)');
        tailGrad.addColorStop(1, f.colorTail);
        ctx.fillStyle = tailGrad;
        ctx.fill();

        // Eyes on both sides of head
        ctx.beginPath();
        ctx.arc(L * 0.32, -W * 0.28, 1.8, 0, Math.PI * 2);
        ctx.arc(L * 0.32, W * 0.28, 1.8, 0, Math.PI * 2);
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
          ? themeScene === 'tet'
            ? 'bg-gradient-to-br from-[#fef2f2] via-[#fff7ed] to-[#fed7aa] text-slate-800'
            : 'bg-[#d8e7f3] text-slate-800'
          : themeScene === 'tet'
          ? 'bg-gradient-to-br from-[#1c0a0a] via-[#12070b] to-[#0c0512] text-slate-100'
          : 'bg-[#060c18] text-slate-100'
      }`}
    >
      {/* Visual Ambiance depending on themeScene */}
      {themeScene === 'tet' ? (
        <>
          {/* Falling Hoa Mai (Apricot) and Hoa Đào (Peach) Blossom Petals + Firework Sparks */}
          <TetBlossomCanvas />
          {/* Traditional Hanging Red Silk Lanterns with Golden Tassels */}
          <TetLanterns />
        </>
      ) : (
        /* Dynamic Animated Canvas for 3D Aquatic Cube & Swimming Koi Fishes */
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0 opacity-90"
        />
      )}

      {/* Top Header Bar */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between z-20 relative">
        {/* Brand & Round Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-red-600 dark:text-red-500 overflow-hidden">
            {themeScene === 'tet' ? (
              <span className="text-lg">🌸</span>
            ) : (
              <Brain className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{t.appName}</span>
              {themeScene === 'tet' && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs">
                  <span>🧧</span>
                  <span>{t.tetBadge}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Tools (Scene Toggle, Language VI/EN, Theme Toggle ☀️, Sign In) */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Theme Scene Toggle (Tết 2026 vs Aquatic Koi) */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-700 backdrop-blur-md shadow-xs">
            <button
              type="button"
              onClick={() => setThemeScene('tet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeScene === 'tet'
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Không Khí Tết 2026"
            >
              <span>🌸</span>
              <span className="hidden md:inline">{t.tetTabFestive}</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeScene('aquatic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeScene === 'aquatic'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Hồ Cá Koi 3D"
            >
              <span>🐟</span>
              <span className="hidden md:inline">{t.tetTabAquatic}</span>
            </button>
          </div>

          {/* Language Toggle VI <-> EN */}
          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              className="h-9 px-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs hover:bg-white transition-all cursor-pointer"
              title={t.switchLang}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span className="uppercase">{lang}</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle ☀️ */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="h-9 w-9 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs hover:bg-white transition-all"
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
            className="h-9 px-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white hover:bg-white flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>{t.loginTab}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center relative z-10 px-6 sm:px-14 lg:px-20 pb-16">
        {/* Left Side: Hero Content */}
        <main className="max-w-3xl space-y-6">
          {/* Festive Holiday Banner */}
          {themeScene === 'tet' ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/90 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-xs font-extrabold text-red-700 dark:text-red-300 shadow-xs">
              <span className="animate-spin" style={{ animationDuration: '6s' }}>🌸</span>
              <span>{t.tetGreeting}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">★</span>
              <span>Xuân Bính Ngọ Rạng Rỡ</span>
            </div>
          ) : (
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide font-sans">
              {t.heroCompanyTag}
            </div>
          )}

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

            {/* Quick Demo Blessing Trigger in Tet mode */}
            {themeScene === 'tet' && (
              <button
                onClick={() => {
                  setAuthTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="h-12 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                title="Nhận Lộc Đầu Xuân"
              >
                <span>🧧</span>
                <span>Khai Xuân Nhận Lộc</span>
              </button>
            )}
          </div>
        </main>

        {/* Right Side: 3D Festive Tết Showcase Card (when in Tet Mode) */}
        {themeScene === 'tet' && (
          <aside
            aria-label="Không Khí Tết 2026"
            className="hidden lg:flex absolute right-10 xl:right-16 top-1/2 -translate-y-1/2 z-10 w-[420px] xl:w-[460px] flex-col items-center pointer-events-auto"
          >
            {/* 3D Festive Glassmorphic Card */}
            <div className="relative group p-2.5 rounded-3xl bg-gradient-to-b from-amber-400/40 via-red-500/20 to-amber-500/30 backdrop-blur-md border-2 border-amber-400/70 shadow-2xl shadow-red-900/20 transition-all hover:scale-[1.02]">
              <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-950">
                <img
                  src="/tet_hero.jpg"
                  alt="Múa Lân Ngày Tết 2026"
                  className="w-full h-[290px] xl:h-[330px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle gradient overlay & tags */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-extrabold shadow-md border border-amber-300 backdrop-blur-xs">
                  <span>🌸</span>
                  <span>Xuân Bính Ngọ 2026</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-extrabold shadow-md border border-yellow-200">
                  <span>🧧</span>
                  <span>Múa Lân Rước Lộc</span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <div>
                    <div className="text-xs font-extrabold text-amber-300">
                      Lễ Hội Mùa Xuân & Tri Thức Doanh Nghiệp
                    </div>
                    <div className="text-[11px] text-slate-200">
                      Hoa Mai Đào Nở Rộ • Vạn Sự Hanh Thông
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAuthTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>🧧</span>
                    <span>Đăng Nhập</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Auspicious Traditional Couplet Ribbon */}
            <div className="mt-3.5 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-300/80 dark:border-amber-500/50 shadow-md text-center max-w-sm">
              <div className="text-xs font-extrabold text-red-600 dark:text-red-400 tracking-wide">
                {t.tetBannerCouplet}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* TET HOLIDAY BACKGROUND MUSIC PLAYER (PLAYS ONCE, NO LOOP) */}
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
