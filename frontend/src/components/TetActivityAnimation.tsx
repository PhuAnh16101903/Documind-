import React, { useState, useEffect } from 'react';
import { Lottie } from 'lottie-react';
import lionDanceAnimation from '../assets/lottie/lion_dance.json';
import cookingPotAnimation from '../assets/lottie/boiling_pot.json';
import redEnvelopeAnimation from '../assets/lottie/lucky_envelope_open.json';

interface TetActivityAnimationProps {
  onOpenLogin?: () => void;
  className?: string;
}

export const TetActivityAnimation: React.FC<TetActivityAnimationProps> = ({
  onOpenLogin,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'lion' | 'banh_chung' | 'li_xi'>('lion');

  // Auto-cycle through the 3 activities every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === 'lion') return 'banh_chung';
        if (prev === 'banh_chung') return 'li_xi';
        return 'lion';
      });
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-full max-w-[480px] rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-amber-300/60 dark:border-amber-500/40 p-4 shadow-2xl shadow-amber-900/15 flex flex-col gap-3 font-sans select-none ${className}`}
    >
      {/* Tab Switcher for the 3 iconic activities requested by user */}
      <div className="flex items-center justify-between gap-1 p-1 bg-amber-50/80 dark:bg-slate-800/80 rounded-2xl border border-amber-200/60 dark:border-slate-700/60 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('lion')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'lion'
              ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs scale-102 font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🦁</span>
          <span>Múa Lân</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banh_chung')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'banh_chung'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs scale-102 font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🎋</span>
          <span>Bánh Chưng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('li_xi')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'li_xi'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-xs scale-102 font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🧧</span>
          <span>Nhận Lì Xì</span>
        </button>
      </div>

      {/* Main Animated Stage Area (Lottie Vector 60fps) */}
      <div className="relative h-[250px] sm:h-[270px] rounded-2xl overflow-hidden bg-gradient-to-b from-amber-100/50 via-rose-50/40 to-amber-100/60 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950 border border-amber-200/50 dark:border-slate-800 flex items-center justify-center">
        {/* Floating background ambient dust */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <div className="absolute bottom-6 left-14 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" />
        </div>

        {/* ========================================================= */}
        {/* SCENE 1: MÚA LÂN SƯ RỒNG (LOTTIE VECTOR ANIMATION) */}
        {/* ========================================================= */}
        {activeTab === 'lion' && (
          <div className="relative flex flex-col items-center justify-center animate-fade-in w-full h-full p-2">
            <div
              onClick={onOpenLogin}
              className="relative cursor-pointer group flex flex-col items-center justify-center"
              title="Nhấn để vào không gian tri thức!"
            >
              <div className="w-48 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Lottie
                  src={lionDanceAnimation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs font-extrabold text-red-700 dark:text-red-400">
                🦁 Múa Lân Sư Rồng Rước Lộc Khởi Xuân
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: NỒI BÁNH CHƯNG XANH (LOTTIE VECTOR ANIMATION) */}
        {/* ========================================================= */}
        {activeTab === 'banh_chung' && (
          <div className="relative flex flex-col items-center justify-center animate-fade-in w-full h-full p-2">
            <div
              onClick={onOpenLogin}
              className="relative cursor-pointer group flex flex-col items-center justify-center"
              title="Nhấn để vào không gian tri thức!"
            >
              <div className="w-48 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Lottie
                  src={cookingPotAnimation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                🎋 Bánh Chưng Xanh Nghi Ngút Khói Chiều 30 Tết
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 3: EM BÉ NHẬN LÌ XÌ (LOTTIE VECTOR ANIMATION) */}
        {/* ========================================================= */}
        {activeTab === 'li_xi' && (
          <div className="relative flex flex-col items-center justify-center animate-fade-in w-full h-full p-2">
            <div
              onClick={onOpenLogin}
              className="relative cursor-pointer group flex flex-col items-center justify-center"
              title="Nhấn để vào không gian tri thức!"
            >
              <div className="w-48 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Lottie
                  src={redEnvelopeAnimation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400">
                🧧 Trao Nhận Lì Xì Khai Xuân Như Ý
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
          Chạm vào hoạt họa để nhận lộc xuân ✨
        </span>
        <button
          onClick={onOpenLogin}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>🧧</span>
          <span>Đăng Nhập</span>
        </button>
      </div>
    </div>
  );
};
