import React, { useState, useEffect, useRef } from 'react';
import tetLionStage from '../assets/tet_lion_stage.jpg';
import tetBanhChung from '../assets/tet_banh_chung.jpg';
import tetLiXi from '../assets/tet_li_xi.jpg';

interface TetActivityAnimationProps {
  onOpenLogin?: () => void;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'spark' | 'ember' | 'coin' | 'blossom';
  rotation?: number;
  vRot?: number;
}

export const TetActivityAnimation: React.FC<TetActivityAnimationProps> = ({
  onOpenLogin,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'lion' | 'banh_chung' | 'li_xi'>('lion');
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [clickCelebration, setClickCelebration] = useState<{ active: boolean; text: string }>({
    active: false,
    text: '',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Auto-cycle through the 3 activities every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setActiveTab((prev) => {
          if (prev === 'lion') return 'banh_chung';
          if (prev === 'banh_chung') return 'li_xi';
          return 'lion';
        });
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Handle 3D Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 8;
    setTilt({
      x: (y / (rect.height / 2)) * -maxTilt,
      y: (x / (rect.width / 2)) * maxTilt,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Trigger celebration on click
  const handleCardClick = (e: React.MouseEvent) => {
    const greetings = [
      '🧧 Cung Chúc Tân Xuân!',
      '🌸 Vạn Sự Như Ý!',
      '✨ Tấn Tài Tấn Lộc!',
      '🎋 An Khang Thịnh Vượng!',
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    setClickCelebration({ active: true, text: greeting });
    setTimeout(() => setClickCelebration({ active: false, text: '' }), 1800);

    // Burst extra celebratory particles at click position
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: ['#fbbf24', '#f59e0b', '#ef4444', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 5)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          type: 'spark',
        });
      }
    }
  };

  // Live Canvas Particle Animation System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 440);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle spawn logic according to active tab
    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Spawn ambient particles based on active tab
      if (activeTab === 'lion') {
        // Golden fireworks & sparks
        if (frameCount % 4 === 0 && particlesRef.current.length < 55) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.7,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            size: Math.random() * 3 + 1.5,
            color: ['#fbbf24', '#fde047', '#f43f5e', '#ffedd5'][Math.floor(Math.random() * 4)],
            alpha: 1,
            decay: Math.random() * 0.02 + 0.01,
            type: 'spark',
          });
        }
      } else if (activeTab === 'banh_chung') {
        // Campfire glowing embers & smoke
        if (frameCount % 3 === 0 && particlesRef.current.length < 60) {
          particlesRef.current.push({
            x: width * 0.5 + (Math.random() - 0.5) * 140,
            y: height * 0.85,
            vx: (Math.random() - 0.5) * 1.8,
            vy: -Math.random() * 2.5 - 1.2,
            size: Math.random() * 3.5 + 1.2,
            color: ['#f97316', '#ea580c', '#fbbf24', '#ef4444'][Math.floor(Math.random() * 4)],
            alpha: 1,
            decay: Math.random() * 0.018 + 0.008,
            type: 'ember',
          });
        }
      } else {
        // Lucky golden coins & sparkles drifting down
        if (frameCount % 4 === 0 && particlesRef.current.length < 50) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 1.8 + 1,
            size: Math.random() * 5 + 3,
            color: '#f59e0b',
            alpha: 1,
            decay: 0.006,
            type: 'coin',
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.08,
          });
        }
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 20 || p.y < -30) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'coin') {
          p.rotation = (p.rotation || 0) + (p.vRot || 0.04);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1;
          ctx.stroke();
          // Inner coin square hole
          ctx.fillStyle = '#b45309';
          ctx.fillRect(-p.size * 0.3, -p.size * 0.3, p.size * 0.6, p.size * 0.6);
        } else if (p.type === 'ember') {
          // Glowing campfire ember
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Spark / star
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`relative w-full max-w-[490px] rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-2 border-amber-300/80 dark:border-amber-500/60 p-4 shadow-2xl shadow-amber-900/20 flex flex-col gap-3 font-sans select-none cursor-pointer group hover:shadow-amber-500/20 transition-shadow ${className}`}
    >
      {/* Top Ambient Glow Ribbon */}
      <div className="absolute -top-1 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[1px]" />

      {/* Tab Switcher for the 3 iconic activities requested by user */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between gap-1 p-1 bg-amber-50/90 dark:bg-slate-800/90 rounded-2xl border border-amber-200/80 dark:border-slate-700 text-xs font-bold shadow-xs z-20"
      >
        <button
          type="button"
          onClick={() => setActiveTab('lion')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'lion'
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white shadow-md font-extrabold scale-102'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60'
          }`}
        >
          <span className="text-sm">🦁</span>
          <span>Múa Lân</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banh_chung')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'banh_chung'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white shadow-md font-extrabold scale-102'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60'
          }`}
        >
          <span className="text-sm">🎋</span>
          <span>Bánh Chưng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('li_xi')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'li_xi'
              ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white shadow-md font-extrabold scale-102'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60'
          }`}
        >
          <span className="text-sm">🧧</span>
          <span>Nhận Lì Xì</span>
        </button>
      </div>

      {/* Main Animated Visual Display Stage */}
      <div className="relative h-[270px] sm:h-[300px] rounded-2xl overflow-hidden border border-amber-300/80 dark:border-amber-500/40 shadow-inner group/stage">
        {/* ========================================================= */}
        {/* SCENE 1: MÚA LÂN SƯ RỒNG KHỞI XUÂN */}
        {/* ========================================================= */}
        {activeTab === 'lion' && (
          <div className="relative w-full h-full animate-fade-in overflow-hidden">
            <img
              src={tetLionStage}
              alt="Múa Lân Sư Rồng Khởi Xuân"
              className="w-full h-full object-cover object-center group-hover/stage:scale-105 transition-transform duration-700"
            />
            {/* Shimmer light reflection */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

            {/* Floating Banner Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600/90 text-white font-extrabold text-[11px] shadow-md border border-amber-300/60 flex items-center gap-1.5">
              <span>🌸</span>
              <span>Xuân Bính Ngọ 2026</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20">
              <div>
                <div className="text-sm font-extrabold text-amber-300 drop-shadow-md flex items-center gap-1.5">
                  <span>🦁 Múa Lân Sư Rồng Rước Lộc</span>
                </div>
                <div className="text-[11px] text-white/90 drop-shadow-sm font-medium">
                  Trống dong cờ mở · Vạn sự hanh thông · Khởi sắc đầu xuân
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: NỒI BÁNH CHƯNG XANH CHIỀU 30 TẾT */}
        {/* ========================================================= */}
        {activeTab === 'banh_chung' && (
          <div className="relative w-full h-full animate-fade-in overflow-hidden">
            <img
              src={tetBanhChung}
              alt="Nấu Bánh Chưng Xanh Chiều 30 Tết"
              className="w-full h-full object-cover object-center group-hover/stage:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

            {/* Warm fire glow effect */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />

            {/* Floating Banner Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-[11px] shadow-md border border-emerald-300/60 flex items-center gap-1.5">
              <span>🎋</span>
              <span>Nếp Thơm Bánh Chưng</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20">
              <div>
                <div className="text-sm font-extrabold text-amber-300 drop-shadow-md flex items-center gap-1.5">
                  <span>🎋 Nồi Bánh Chưng Xanh Chiều 30 Tết</span>
                </div>
                <div className="text-[11px] text-white/90 drop-shadow-sm font-medium">
                  Bếp than ấm cúng · Khói tỏa nồng nàn · Sum vầy gia đình
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 3: EM BÉ NHẬN LÌ XÌ KHAI XUÂN NHƯ Ý */}
        {/* ========================================================= */}
        {activeTab === 'li_xi' && (
          <div className="relative w-full h-full animate-fade-in overflow-hidden">
            <img
              src={tetLiXi}
              alt="Nhận Lì Xì Khai Xuân Như Ý"
              className="w-full h-full object-cover object-center group-hover/stage:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

            {/* Floating Banner Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600/90 text-white font-extrabold text-[11px] shadow-md border border-rose-300/60 flex items-center gap-1.5">
              <span>🧧</span>
              <span>Lộc Xuân Đắc Lợi</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20">
              <div>
                <div className="text-sm font-extrabold text-amber-300 drop-shadow-md flex items-center gap-1.5">
                  <span>🧧 Trao Nhận Lì Xì May Mắn</span>
                </div>
                <div className="text-[11px] text-white/90 drop-shadow-sm font-medium">
                  Nụ cười trẻ thơ · Áo dài rực rỡ · Tấn tài tấn lộc
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Canvas Particle Physics Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Click Celebration Splash Overlay */}
        {clickCelebration.active && (
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-xs flex flex-col items-center justify-center animate-fade-in z-30 pointer-events-none">
            <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-2xl border-2 border-amber-300 animate-bounce">
              {clickCelebration.text}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between pt-1 text-xs"
      >
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Chạm vào hoạt họa để nhận lộc xuân ✨</span>
        </span>

        <button
          onClick={onOpenLogin}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-red-900/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>🧧</span>
          <span>Vào Hệ Thống</span>
        </button>
      </div>
    </div>
  );
};

export default TetActivityAnimation;
