import React from 'react';

export const TetLanterns: React.FC = () => {
  return (
    <div className="absolute top-16 left-0 right-0 pointer-events-none z-10 overflow-hidden flex justify-between px-4 sm:px-8 lg:px-12">
      {/* Left Lantern Group - Positioned safely at outer margin */}
      <div className="flex items-start gap-2.5 -mt-2">
        {/* Main Large Lantern */}
        <div
          className="relative flex flex-col items-center"
          style={{
            animation: 'swingLantern 3.8s ease-in-out infinite alternate',
            transformOrigin: 'top center',
          }}
        >
          {/* Black/Gold Hanging String */}
          <div className="w-[1.5px] h-6 bg-amber-600/80 shadow-xs" />

          {/* Top Gold Cap */}
          <div className="w-8 h-2.5 rounded-t-md bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-sm" />

          {/* Red Lantern Body */}
          <div className="w-14 h-16 rounded-[26px] bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-lg shadow-red-500/30 relative overflow-hidden flex items-center justify-center border-t border-b border-amber-400/50">
            {/* Inner Gold Ribs */}
            <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-40">
              <div className="w-[1px] h-full bg-amber-300" />
              <div className="w-[1px] h-full bg-amber-300" />
            </div>

            {/* Auspicious Golden Character */}
            <span className="text-amber-200 text-xs font-extrabold tracking-widest font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              TẾT
            </span>
          </div>

          {/* Bottom Gold Cap */}
          <div className="w-8 h-2.5 rounded-b-md bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-sm" />

          {/* Golden Tassel */}
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 border border-yellow-200 shadow-xs" />
            <div className="w-3.5 h-10 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-sm opacity-90 shadow-xs" />
          </div>
        </div>

        {/* Small Companion Lantern */}
        <div
          className="hidden xl:flex flex-col items-center -mt-3 opacity-90"
          style={{
            animation: 'swingLantern 4.5s ease-in-out infinite alternate-reverse',
            transformOrigin: 'top center',
          }}
        >
          <div className="w-[1.5px] h-4 bg-amber-600/80" />
          <div className="w-5 h-2 rounded-t-sm bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700" />
          <div className="w-10 h-11 rounded-[18px] bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-md shadow-red-500/30 flex items-center justify-center border-t border-b border-amber-400/40">
            <span className="text-amber-200 text-[9px] font-bold font-serif">
              LỘC
            </span>
          </div>
          <div className="w-5 h-2 rounded-b-sm bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700" />
          <div className="w-2.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-sm" />
        </div>
      </div>

      {/* Right Lantern Group - Positioned safely at outer margin */}
      <div className="flex items-start gap-2.5 -mt-2">
        {/* Small Companion Lantern */}
        <div
          className="hidden xl:flex flex-col items-center -mt-3 opacity-90"
          style={{
            animation: 'swingLantern 4.2s ease-in-out infinite alternate',
            transformOrigin: 'top center',
          }}
        >
          <div className="w-[1.5px] h-4 bg-amber-600/80" />
          <div className="w-5 h-2 rounded-t-sm bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700" />
          <div className="w-10 h-11 rounded-[18px] bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-md shadow-red-500/30 flex items-center justify-center border-t border-b border-amber-400/40">
            <span className="text-amber-200 text-[9px] font-bold font-serif">
              PHÚC
            </span>
          </div>
          <div className="w-5 h-2 rounded-b-sm bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700" />
          <div className="w-2.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-sm" />
        </div>

        {/* Main Large Lantern */}
        <div
          className="relative flex flex-col items-center"
          style={{
            animation: 'swingLantern 3.6s ease-in-out infinite alternate-reverse',
            transformOrigin: 'top center',
          }}
        >
          <div className="w-[1.5px] h-6 bg-amber-600/80 shadow-xs" />
          <div className="w-8 h-2.5 rounded-t-md bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-sm" />
          <div className="w-14 h-16 rounded-[26px] bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-lg shadow-red-500/30 relative overflow-hidden flex items-center justify-center border-t border-b border-amber-400/50">
            <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-40">
              <div className="w-[1px] h-full bg-amber-300" />
              <div className="w-[1px] h-full bg-amber-300" />
            </div>
            <span className="text-amber-200 text-xs font-extrabold tracking-widest font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              XUÂN
            </span>
          </div>
          <div className="w-8 h-2.5 rounded-b-md bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-sm" />
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 border border-yellow-200 shadow-xs" />
            <div className="w-3.5 h-10 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-sm opacity-90 shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
