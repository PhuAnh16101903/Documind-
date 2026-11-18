import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Gift, Flame } from 'lucide-react';

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

      {/* Main Animated Stage Area */}
      <div className="relative h-[250px] sm:h-[270px] rounded-2xl overflow-hidden bg-gradient-to-b from-amber-100/50 via-rose-50/40 to-amber-100/60 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950 border border-amber-200/50 dark:border-slate-800 flex items-center justify-center">
        {/* Floating background ambient dust */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <div className="absolute bottom-6 left-14 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" />
        </div>

        {/* ========================================================= */}
        {/* SCENE 1: MÚA LÂN SƯ RỒNG (LION DANCE) */}
        {/* ========================================================= */}
        {activeTab === 'lion' && (
          <div className="relative flex flex-col items-center justify-center animate-fade-in w-full h-full">
            {/* Pop-up lucky coins */}
            <div
              className="absolute top-8 left-16 text-lg"
              style={{ animation: 'coinFloat 2.8s ease-in-out infinite' }}
            >
              🪙
            </div>
            <div
              className="absolute top-6 right-20 text-lg"
              style={{ animation: 'coinFloat 3.2s ease-in-out 1s infinite' }}
            >
              ✨
            </div>

            {/* Animated Lion Character */}
            <div
              className="relative flex flex-col items-center cursor-pointer group"
              style={{ animation: 'lionBob 2.4s ease-in-out infinite' }}
              onClick={onOpenLogin}
              title="Nhấn để chúc mừng năm mới!"
            >
              {/* Lion Horn & Top Tuft */}
              <div className="relative -mb-1 flex flex-col items-center">
                <div className="w-4 h-7 rounded-t-full bg-gradient-to-t from-amber-500 to-yellow-300 border border-yellow-200 shadow-sm" />
                <div className="w-8 h-3 rounded-full bg-red-600 -mt-1 shadow-xs" />
              </div>

              {/* Lion Head */}
              <div className="relative w-32 h-28 rounded-[36px] bg-gradient-to-b from-red-500 via-rose-600 to-red-700 border-2 border-amber-300 shadow-xl flex flex-col items-center p-2.5">
                {/* Wiggling Ears */}
                <div
                  className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-amber-400 border-2 border-red-600"
                  style={{ animation: 'earWiggle 1.8s ease-in-out infinite alternate' }}
                />
                <div
                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-amber-400 border-2 border-red-600"
                  style={{ animation: 'earWiggle 1.8s ease-in-out infinite alternate-reverse' }}
                />

                {/* Expressive Big Eyes with blink */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-amber-400 flex items-center justify-center shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-slate-900 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-amber-400 flex items-center justify-center shadow-inner">
                    <div className="w-4 h-4 rounded-full bg-slate-900 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                </div>

                {/* Cute Smiling Mouth with Golden Mustache */}
                <div className="mt-2 w-16 h-7 rounded-b-full bg-amber-400 border border-yellow-200 flex items-center justify-center shadow-sm">
                  <div className="w-8 h-3 rounded-b-full bg-red-800" />
                </div>
              </div>

              {/* Dancing Silk Robe Body */}
              <div className="w-36 h-12 rounded-b-3xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border border-amber-300 flex items-center justify-around px-4 shadow-md -mt-1">
                <span className="text-amber-200 font-extrabold text-xs">★</span>
                <span className="text-white font-extrabold text-xs font-serif tracking-widest">TẾT 2026</span>
                <span className="text-amber-200 font-extrabold text-xs">★</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-extrabold text-red-700 dark:text-red-400">
                🦁 Múa Lân Sư Rồng Rước Lộc Khởi Xuân
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: NỒI BÁNH CHƯNG XANH (COOKING BÁNH CHƯNG) */}
        {/* ========================================================= */}
        {activeTab === 'banh_chung' && (
          <div className="relative flex flex-col items-center justify-center animate-fade-in w-full h-full">
            {/* Rising Animated Steam Puffs */}
            <div
              className="absolute top-6 left-1/2 -translate-x-6 text-xl opacity-70"
              style={{ animation: 'steamFlow 2.5s ease-out infinite' }}
            >
              💨
            </div>
            <div
              className="absolute top-4 left-1/2 translate-x-2 text-2xl opacity-80"
              style={{ animation: 'steamFlow 3s ease-out 0.8s infinite' }}
            >
              ☁️
            </div>

            {/* Boiling Pot with Square Bánh Chưng inside */}
            <div className="relative flex flex-col items-center">
              {/* Cooking Pot */}
              <div className="relative w-36 h-28 rounded-t-xl rounded-b-3xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-600 shadow-2xl flex flex-col items-center justify-between p-2">
                {/* Pot Handles */}
                <div className="absolute top-4 -left-3 w-3 h-8 rounded-l-md bg-slate-600 border border-slate-500" />
                <div className="absolute top-4 -right-3 w-3 h-8 rounded-r-md bg-slate-600 border border-slate-500" />

                {/* Delicious Square Green Bánh Chưng peeking out */}
                <div className="w-18 h-18 rounded-lg bg-gradient-to-tr from-emerald-700 via-green-600 to-emerald-500 border-2 border-yellow-300 shadow-md relative flex items-center justify-center transform rotate-6">
                  {/* Yellow Bamboo Strings (Lạt giang) */}
                  <div className="absolute inset-y-0 w-1 bg-yellow-300" />
                  <div className="absolute inset-x-0 h-1 bg-yellow-300" />
                  {/* Red Square Label */}
                  <div className="w-6 h-6 rounded-xs bg-red-600 border border-amber-300 flex items-center justify-center shadow-xs">
                    <span className="text-[8px] font-extrabold text-amber-200">XUÂN</span>
                  </div>
                </div>

                {/* Pot Belly Rim */}
                <div className="w-full h-2 rounded-full bg-slate-600" />
              </div>

              {/* Crackling Firewood & Animated Flames */}
              <div className="relative -mt-2 flex items-center justify-center">
                {/* Firewood logs */}
                <div className="w-40 h-3 rounded-full bg-amber-950 border border-amber-900 rotate-3 shadow-xs" />
                <div className="w-40 h-3 rounded-full bg-amber-900 border border-amber-800 -rotate-3 -mt-2 shadow-xs" />

                {/* Animated Dancing Flames */}
                <div
                  className="absolute -top-5 flex items-center gap-1"
                  style={{ animation: 'fireCrack 1.2s ease-in-out infinite alternate' }}
                >
                  <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">🔥</span>
                  <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] -mt-2">🔥</span>
                  <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">🔥</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                🎋 Nồi Bánh Chưng Xanh Nghi Ngút Khói Chiều 30 Tết
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 3: EM BÉ NHẬN LÌ XÌ (RECEIVING LUCKY ENVELOPES) */}
        {/* ========================================================= */}
        {activeTab === 'li_xi' && (
          <div className="relative flex flex-col items-center justify-center animate-fade-in w-full h-full">
            {/* Floating Gold Stars & Hearts */}
            <div
              className="absolute top-4 left-14 text-xl"
              style={{ animation: 'coinFloat 2.8s ease-in-out infinite' }}
            >
              💖
            </div>
            <div
              className="absolute top-6 right-16 text-xl"
              style={{ animation: 'coinFloat 3.4s ease-in-out 1s infinite' }}
            >
              🧧
            </div>

            {/* Cheerful Characters & Red Envelopes */}
            <div className="relative flex items-center justify-center gap-6">
              {/* Joyful Red Envelope (Animated Swaying) */}
              <div
                className="w-20 h-30 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 border-2 border-amber-300 shadow-xl p-2 flex flex-col items-center justify-between cursor-pointer hover:scale-110 transition-transform"
                style={{ animation: 'envelopeSway 3s ease-in-out infinite' }}
                onClick={onOpenLogin}
                title="Nhận lì xì may mắn!"
              >
                {/* Envelope Flap */}
                <div className="w-14 h-4 rounded-b-full bg-amber-400 border border-yellow-200 shadow-xs" />

                {/* Auspicious Gold Medallion */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border border-yellow-100 flex items-center justify-center shadow-md">
                  <span className="text-xs font-extrabold text-red-700 font-serif">LỘC</span>
                </div>

                <div className="text-[9px] font-bold text-amber-200 tracking-wider">
                  BÍNH NGỌ
                </div>
              </div>

              {/* Cartoon Child in Áo Dài */}
              <div className="flex flex-col items-center">
                {/* Child Head with hair buns / traditional headband */}
                <div className="relative w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 shadow-md flex items-center justify-center">
                  {/* Traditional Khăn Đóng */}
                  <div className="absolute -top-2 w-14 h-4 rounded-full bg-red-600 border border-amber-300" />
                  {/* Smiling Eyes */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800">^</span>
                    <span className="text-xs font-bold text-slate-800">^</span>
                  </div>
                  {/* Blushing Cheeks */}
                  <div className="absolute bottom-3 flex items-center justify-between w-10">
                    <div className="w-2 h-1 rounded-full bg-rose-400" />
                    <div className="w-2 h-1 rounded-full bg-rose-400" />
                  </div>
                </div>

                {/* Traditional Áo Dài Body */}
                <div className="w-18 h-16 rounded-t-xl rounded-b-2xl bg-gradient-to-b from-red-600 via-rose-600 to-red-700 border border-amber-300 flex flex-col items-center justify-center shadow-md -mt-1 p-1">
                  <span className="text-[10px] font-extrabold text-amber-200 font-serif">PHÚC</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400">
                🧧 Bé Vui Nhận Lì Xì • Chúc Tết Ông Bà Cha Mẹ
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
