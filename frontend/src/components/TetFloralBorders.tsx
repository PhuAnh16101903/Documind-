import React from 'react';

interface TetFloralBordersProps {
  className?: string;
  showCouplets?: boolean;
}

export const TetFloralBorders: React.FC<TetFloralBordersProps> = ({
  className = '',
  showCouplets = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-10 overflow-hidden select-none ${className}`}
    >
      {/* ========================================================= */}
      {/* LEFT SIDE: NHÁNH HOA ĐÀO (PINK PEACH BLOSSOM BRANCH) */}
      {/* ========================================================= */}
      <div
        className="absolute top-12 -left-8 sm:left-0 w-48 sm:w-60 md:w-72 h-72 sm:h-88 opacity-90"
        style={{
          animation: 'swayLeftBranch 6s ease-in-out infinite alternate',
          transformOrigin: 'top left',
        }}
      >
        <svg viewBox="0 0 320 400" fill="none" className="w-full h-full drop-shadow-md">
          {/* Main rustic woody branch */}
          <path
            d="M-20 -10 C40 30, 80 80, 110 150 C130 190, 140 240, 155 310"
            stroke="#5c3826"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M40 30 C90 20, 150 40, 190 70 C220 90, 240 120, 260 160"
            stroke="#6b412b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M110 150 C150 160, 190 190, 210 230"
            stroke="#7a4b32"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M190 70 C210 50, 240 45, 270 50"
            stroke="#7a4b32"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M140 240 C170 260, 190 290, 205 330"
            stroke="#6b412b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Fresh young green spring leaves */}
          <path d="M100 120 C120 110, 130 125, 110 135 Z" fill="#65a30d" />
          <path d="M175 60 C195 50, 205 65, 185 75 Z" fill="#84cc16" />
          <path d="M230 100 C250 95, 255 110, 235 118 Z" fill="#65a30d" />
          <path d="M145 205 C165 195, 175 210, 155 220 Z" fill="#84cc16" />
          <path d="M195 250 C215 240, 220 255, 205 265 Z" fill="#65a30d" />

          {/* Peach Blossom Clusters (Hoa Đào Hồng) */}
          {/* Flower 1 (Large - top center) */}
          <g transform="translate(190, 70)">
            <circle cx="0" cy="0" r="16" fill="url(#pinkGlow)" />
            {/* 5 Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-9 -18, 9 -18, 0 0"
                fill="#f43f5e"
                stroke="#fda4af"
                strokeWidth="1"
                transform={`rotate(${angle}) scale(1.3)`}
              />
            ))}
            {/* Flower Center Stamen */}
            <circle cx="0" cy="0" r="4.5" fill="#fef08a" />
            <circle cx="0" cy="0" r="2.5" fill="#e11d48" />
          </g>

          {/* Flower 2 (Large - mid branch) */}
          <g transform="translate(110, 150)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-10 -20, 10 -20, 0 0"
                fill="#fb7185"
                stroke="#ffe4e6"
                strokeWidth="1"
                transform={`rotate(${angle + 20}) scale(1.4)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#fef08a" />
            <circle cx="0" cy="0" r="2.5" fill="#be123c" />
          </g>

          {/* Flower 3 (Right tip) */}
          <g transform="translate(260, 160)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-8 -16, 8 -16, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle + 35}) scale(1.1)`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
          </g>

          {/* Flower 4 (Upper branch) */}
          <g transform="translate(268, 50)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-8 -16, 8 -16, 0 0"
                fill="#fda4af"
                transform={`rotate(${angle + 10}) scale(1.15)`}
              />
            ))}
            <circle cx="0" cy="0" r="4" fill="#fef08a" />
          </g>

          {/* Flower 5 (Lower stem) */}
          <g transform="translate(155, 305)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-8 -17, 8 -17, 0 0"
                fill="#fb7185"
                transform={`rotate(${angle + 45}) scale(1.2)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fef08a" />
          </g>

          {/* Flower 6 (Branch fork) */}
          <g transform="translate(210, 230)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-7 -15, 7 -15, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle + 15})`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#fde047" />
          </g>

          {/* Buds (Nụ hoa đào) */}
          <circle cx="140" cy="80" r="6" fill="#f43f5e" stroke="#fda4af" strokeWidth="1" />
          <circle cx="70" cy="50" r="5" fill="#fb7185" />
          <circle cx="230" cy="65" r="5.5" fill="#f43f5e" />
          <circle cx="180" cy="285" r="6" fill="#f43f5e" />
          <circle cx="125" cy="270" r="5" fill="#fda4af" />
          <circle cx="290" cy="180" r="4.5" fill="#f43f5e" />

          {/* Defs */}
          <defs>
            <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: NHÁNH HOA MAI (GOLDEN APRICOT BLOSSOM BRANCH) */}
      {/* ========================================================= */}
      <div
        className="absolute -top-4 -right-6 sm:right-0 w-48 sm:w-64 md:w-80 h-80 sm:h-96"
        style={{
          animation: 'swayRightBranch 6.5s ease-in-out infinite alternate',
          transformOrigin: 'top right',
        }}
      >
        <svg viewBox="0 0 320 400" fill="none" className="w-full h-full drop-shadow-md">
          {/* Main rustic woody branch curving inward from right */}
          <path
            d="M340 -10 C280 30, 240 80, 210 150 C190 190, 180 240, 165 310"
            stroke="#5c3826"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M280 30 C230 20, 170 40, 130 70 C100 90, 80 120, 60 160"
            stroke="#6b412b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M210 150 C170 160, 130 190, 110 230"
            stroke="#7a4b32"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M130 70 C110 50, 80 45, 50 50"
            stroke="#7a4b32"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M180 240 C150 260, 130 290, 115 330"
            stroke="#6b412b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Fresh young green spring leaves */}
          <path d="M220 120 C200 110, 190 125, 210 135 Z" fill="#65a30d" />
          <path d="M145 60 C125 50, 115 65, 135 75 Z" fill="#84cc16" />
          <path d="M90 100 C70 95, 65 110, 85 118 Z" fill="#65a30d" />
          <path d="M175 205 C155 195, 145 210, 165 220 Z" fill="#84cc16" />
          <path d="M125 250 C105 240, 100 255, 115 265 Z" fill="#65a30d" />

          {/* Apricot Blossom Clusters (Hoa Mai Vàng Phú Quý) */}
          {/* Flower 1 (Large - top center) */}
          <g transform="translate(130, 70)">
            <circle cx="0" cy="0" r="16" fill="url(#yellowGlow)" />
            {/* 5 Sunny Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-9 -18, 9 -18, 0 0"
                fill="#facc15"
                stroke="#fef08a"
                strokeWidth="1.2"
                transform={`rotate(${angle}) scale(1.3)`}
              />
            ))}
            {/* Center Orange-Red Stamen */}
            <circle cx="0" cy="0" r="4.5" fill="#ea580c" />
            <circle cx="0" cy="0" r="2.5" fill="#fef08a" />
          </g>

          {/* Flower 2 (Large - mid branch) */}
          <g transform="translate(210, 150)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-10 -20, 10 -20, 0 0"
                fill="#eab308"
                stroke="#fef08a"
                strokeWidth="1.2"
                transform={`rotate(${angle + 25}) scale(1.4)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#ea580c" />
            <circle cx="0" cy="0" r="2.5" fill="#fef08a" />
          </g>

          {/* Flower 3 (Left tip) */}
          <g transform="translate(60, 160)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-8 -16, 8 -16, 0 0"
                fill="#facc15"
                transform={`rotate(${angle + 35}) scale(1.1)`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#ea580c" />
          </g>

          {/* Flower 4 (Upper branch tip) */}
          <g transform="translate(52, 50)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-8 -16, 8 -16, 0 0"
                fill="#fde047"
                transform={`rotate(${angle + 10}) scale(1.15)`}
              />
            ))}
            <circle cx="0" cy="0" r="4" fill="#c2410c" />
          </g>

          {/* Flower 5 (Lower stem) */}
          <g transform="translate(165, 305)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-8 -17, 8 -17, 0 0"
                fill="#eab308"
                transform={`rotate(${angle + 45}) scale(1.2)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#ea580c" />
          </g>

          {/* Flower 6 (Branch fork) */}
          <g transform="translate(110, 230)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-7 -15, 7 -15, 0 0"
                fill="#facc15"
                transform={`rotate(${angle + 15})`}
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#c2410c" />
          </g>

          {/* Golden Buds (Nụ hoa mai vàng) */}
          <circle cx="180" cy="80" r="6" fill="#facc15" stroke="#fef08a" strokeWidth="1" />
          <circle cx="250" cy="50" r="5" fill="#eab308" />
          <circle cx="90" cy="65" r="5.5" fill="#facc15" />
          <circle cx="140" cy="285" r="6" fill="#facc15" />
          <circle cx="195" cy="270" r="5" fill="#fde047" />
          <circle cx="30" cy="180" r="4.5" fill="#facc15" />

          {/* Defs */}
          <defs>
            <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* TRADITIONAL RED SILK COUPLETS (CÂU ĐỐI ĐỎ NẠP TÀI TẤN LỘC) */}
      {/* ========================================================= */}
      {showCouplets && (
        <>
          {/* Left Couplet Scroll */}
          <div className="hidden 2xl:flex flex-col items-center absolute left-4 top-40 z-20">
            {/* Top Hanging Ring */}
            <div className="w-1.5 h-6 bg-amber-500 shadow-sm" />
            <div className="w-12 h-2.5 rounded-t-sm bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-sm" />

            {/* Red Silk Banner */}
            <div className="w-10 py-4 rounded-sm bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] border-x-2 border-amber-400/80 shadow-xl flex flex-col items-center justify-center space-y-2.5">
              {'XUÂN AN KHANG THỊNH VƯỢNG'.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="text-[11px] font-extrabold tracking-widest text-amber-200 font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Bottom Wood Roller & Golden Tassel */}
            <div className="w-12 h-2.5 rounded-b-sm bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-amber-500 border border-yellow-200 mt-0.5" />
            <div className="w-3 h-8 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-sm shadow-xs" />
          </div>

          {/* Right Couplet Scroll */}
          <div className="hidden 2xl:flex flex-col items-center absolute right-4 top-40 z-20">
            {/* Top Hanging Ring */}
            <div className="w-1.5 h-6 bg-amber-500 shadow-sm" />
            <div className="w-12 h-2.5 rounded-t-sm bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-sm" />

            {/* Red Silk Banner */}
            <div className="w-10 py-4 rounded-sm bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] border-x-2 border-amber-400/80 shadow-xl flex flex-col items-center justify-center space-y-2.5">
              {'TẾT PHÚ QUÝ VẠN NIÊN TRƯỜNG'.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="text-[11px] font-extrabold tracking-widest text-amber-200 font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Bottom Wood Roller & Golden Tassel */}
            <div className="w-12 h-2.5 rounded-b-sm bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-amber-500 border border-yellow-200 mt-0.5" />
            <div className="w-3 h-8 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-sm shadow-xs" />
          </div>
        </>
      )}

      {/* Global Style for Swaying Branches */}
      <style>{`
        @keyframes swayLeftBranch {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(2.5deg) scale(1.02); }
        }
        @keyframes swayRightBranch {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(-2.5deg) scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default TetFloralBorders;
