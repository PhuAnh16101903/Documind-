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
      {/* 1. LUSH & ELEGANT HOA ĐÀO CANOPY (TOP-LEFT CORNER & OVERHEAD) */}
      {/* Cascades gently along top-left margin without occluding text */}
      {/* ========================================================= */}
      <div
        className="absolute -top-2 -left-2 w-[340px] sm:w-[460px] md:w-[580px] lg:w-[680px] xl:w-[740px] h-[300px] sm:h-[400px] md:h-[480px] lg:h-[540px] drop-shadow-xl transition-transform"
        style={{
          animation: 'swayLeftBranch 7.5s ease-in-out infinite alternate',
          transformOrigin: 'top left',
        }}
      >
        <svg viewBox="0 0 740 540" fill="none" className="w-full h-full">
          {/* Main rugged aged dark wood trunk & curving overhead branches */}
          {/* Trunk arches along top and cascades down the far left side */}
          <path
            d="M-20 -20 C60 20, 110 50, 150 120 C180 180, 185 270, 170 370 C155 450, 130 500, 100 540"
            stroke="#3d2114"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Upper branch sweeping horizontally across the top */}
          <path
            d="M60 20 C160 15, 270 25, 370 50 C460 70, 550 105, 640 140 C680 155, 715 175, 740 200"
            stroke="#4e2b1b"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Mid overhead branch fork */}
          <path
            d="M150 120 C240 110, 330 135, 410 170 C480 205, 540 245, 590 300"
            stroke="#5f3521"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Top edge sub-branch */}
          <path
            d="M370 50 C420 30, 480 25, 550 35 C600 45, 645 65, 690 95"
            stroke="#5f3521"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Left cascading sub-branch */}
          <path
            d="M180 180 C130 220, 90 280, 70 350 C55 410, 45 470, 40 520"
            stroke="#4e2b1b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Upper-mid twig */}
          <path
            d="M410 170 C450 150, 500 155, 540 185"
            stroke="#6e3f27"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Lush Fresh Spring Green Leaf Clusters */}
          <path d="M120 70 C150 50, 170 75, 135 95 Z" fill="#65a30d" />
          <path d="M250 35 C285 20, 300 45, 265 65 Z" fill="#84cc16" />
          <path d="M340 80 C375 65, 390 90, 355 110 Z" fill="#65a30d" />
          <path d="M470 75 C505 60, 520 85, 485 105 Z" fill="#84cc16" />
          <path d="M600 120 C635 105, 650 130, 615 150 Z" fill="#65a30d" />
          <path d="M280 140 C315 125, 330 150, 295 170 Z" fill="#84cc16" />
          <path d="M480 200 C515 185, 530 210, 495 230 Z" fill="#65a30d" />
          <path d="M110 240 C140 220, 155 245, 125 265 Z" fill="#84cc16" />
          <path d="M90 380 C120 360, 135 385, 105 405 Z" fill="#65a30d" />
          <path d="M670 160 C700 145, 715 170, 685 190 Z" fill="#84cc16" />

          {/* Hanging Lucky Red Ribbons & Gold Coins */}
          <g transform="translate(370, 50)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="0" cy="28" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <line x1="0" y1="33" x2="0" y2="46" stroke="#dc2626" strokeWidth="2" strokeDasharray="2 1" />
          </g>
          <g transform="translate(550, 105)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="0" cy="24" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>

          {/* 18+ Abundant Layered Peach Blossoms (Hoa Đào Hồng Thắm) */}
          {/* Flower 1 - Master Overhead Blossom */}
          <g transform="translate(270, 30)">
            <circle cx="0" cy="0" r="30" fill="url(#pinkAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-15 -30, 15 -30, 0 0"
                fill="#f43f5e"
                stroke="#fda4af"
                strokeWidth="1.4"
                transform={`rotate(${angle}) scale(1.65)`}
              />
            ))}
            <circle cx="0" cy="0" r="7.5" fill="#fef08a" />
            <circle cx="0" cy="0" r="3.5" fill="#be123c" />
          </g>

          {/* Flower 2 - Upper Left Branch */}
          <g transform="translate(150, 120)">
            <circle cx="0" cy="0" r="26" fill="url(#pinkAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-14 -28, 14 -28, 0 0"
                fill="#fb7185"
                stroke="#ffe4e6"
                strokeWidth="1.2"
                transform={`rotate(${angle + 25}) scale(1.5)`}
              />
            ))}
            <circle cx="0" cy="0" r="7" fill="#fef08a" />
            <circle cx="0" cy="0" r="3" fill="#9f1239" />
          </g>

          {/* Flower 3 - Top Mid Canopy */}
          <g transform="translate(460, 70)">
            <circle cx="0" cy="0" r="25" fill="url(#pinkAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-13 -26, 13 -26, 0 0"
                fill="#f43f5e"
                stroke="#fda4af"
                strokeWidth="1.2"
                transform={`rotate(${angle + 12}) scale(1.45)`}
              />
            ))}
            <circle cx="0" cy="0" r="6.5" fill="#fef08a" />
            <circle cx="0" cy="0" r="3" fill="#be123c" />
          </g>

          {/* Flower 4 - Far Right Canopy Tip */}
          <g transform="translate(640, 140)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-12 -24, 12 -24, 0 0"
                fill="#fda4af"
                stroke="#ffe4e6"
                strokeWidth="1"
                transform={`rotate(${angle + 30}) scale(1.35)`}
              />
            ))}
            <circle cx="0" cy="0" r="5.5" fill="#fef08a" />
          </g>

          {/* Flower 5 - Far Top-Right Tip */}
          <g transform="translate(730, 195)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle + 40}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#fef08a" />
          </g>

          {/* Flower 6 - Mid Fork Hanging */}
          <g transform="translate(410, 170)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-12 -24, 12 -24, 0 0"
                fill="#fb7185"
                transform={`rotate(${angle + 18}) scale(1.35)`}
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#fef08a" />
          </g>

          {/* Flower 7 - Mid Fork Tip */}
          <g transform="translate(580, 290)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle + 50}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#fef08a" />
          </g>

          {/* Flower 8 - Left Margin Cascade (Upper) */}
          <g transform="translate(170, 270)">
            <circle cx="0" cy="0" r="22" fill="url(#pinkAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-12 -24, 12 -24, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle}) scale(1.35)`}
              />
            ))}
            <circle cx="0" cy="0" r="5.5" fill="#fef08a" />
          </g>

          {/* Flower 9 - Left Margin Cascade (Mid) */}
          <g transform="translate(150, 390)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#fb7185"
                transform={`rotate(${angle + 33}) scale(1.3)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#fef08a" />
          </g>

          {/* Flower 10 - Left Margin Cascade (Lower) */}
          <g transform="translate(95, 520)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle + 5}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fef08a" />
          </g>

          {/* Flower 11 - Top-most Canopy Tip */}
          <g transform="translate(550, 35)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#fda4af"
                transform={`rotate(${angle + 15}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fef08a" />
          </g>

          {/* Flower 12 - Outer Left Branch */}
          <g transform="translate(65, 340)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#f43f5e"
                transform={`rotate(${angle + 45}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fef08a" />
          </g>

          {/* Flower 13 - Far Upper Corner */}
          <g transform="translate(690, 95)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-10 -20, 10 -20, 0 0"
                fill="#fb7185"
                transform={`rotate(${angle + 20}) scale(1.2)`}
              />
            ))}
            <circle cx="0" cy="0" r="4" fill="#fef08a" />
          </g>

          {/* 16+ Plentiful Rose & Coral Buds */}
          <circle cx="190" cy="70" r="8.5" fill="#f43f5e" stroke="#fda4af" strokeWidth="1.3" />
          <circle cx="330" cy="40" r="8" fill="#fb7185" />
          <circle cx="420" cy="60" r="7.5" fill="#f43f5e" />
          <circle cx="510" cy="85" r="8" fill="#f43f5e" />
          <circle cx="610" cy="80" r="7.5" fill="#fb7185" />
          <circle cx="490" cy="160" r="8" fill="#f43f5e" />
          <circle cx="540" cy="230" r="7.5" fill="#fda4af" />
          <circle cx="180" cy="210" r="8" fill="#f43f5e" />
          <circle cx="160" cy="330" r="8" fill="#fb7185" />
          <circle cx="120" cy="440" r="7.5" fill="#f43f5e" />
          <circle cx="50" cy="460" r="7" fill="#fb7185" />
          <circle cx="80" cy="260" r="7.5" fill="#f43f5e" />

          <defs>
            <radialGradient id="pinkAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* 2. LUSH & ELEGANT HOA MAI CANOPY (TOP-RIGHT CORNER & OVERHEAD) */}
      {/* Cascades gently along top-right margin without occluding text */}
      {/* ========================================================= */}
      <div
        className="absolute -top-2 -right-2 w-[340px] sm:w-[460px] md:w-[580px] lg:w-[680px] xl:w-[740px] h-[300px] sm:h-[400px] md:h-[480px] lg:h-[540px] drop-shadow-xl transition-transform"
        style={{
          animation: 'swayRightBranch 8s ease-in-out infinite alternate',
          transformOrigin: 'top right',
        }}
      >
        <svg viewBox="0 0 740 540" fill="none" className="w-full h-full">
          {/* Main rugged aged dark wood trunk & curving overhead branches sweeping from right */}
          <path
            d="M760 -20 C680 20, 630 50, 590 120 C560 180, 555 270, 570 370 C585 450, 610 500, 640 540"
            stroke="#3d2114"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Upper branch sweeping horizontally across the top toward left */}
          <path
            d="M680 20 C580 15, 470 25, 370 50 C280 70, 190 105, 100 140 C60 155, 25 175, 0 200"
            stroke="#4e2b1b"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Mid overhead branch fork */}
          <path
            d="M590 120 C500 110, 410 135, 330 170 C260 205, 200 245, 150 300"
            stroke="#5f3521"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Top edge sub-branch */}
          <path
            d="M370 50 C320 30, 260 25, 190 35 C140 45, 95 65, 50 95"
            stroke="#5f3521"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Right cascading sub-branch */}
          <path
            d="M560 180 C610 220, 650 280, 670 350 C685 410, 695 470, 700 520"
            stroke="#4e2b1b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Upper-mid twig */}
          <path
            d="M330 170 C290 150, 240 155, 200 185"
            stroke="#6e3f27"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Lush Spring Green Leaf Clusters */}
          <path d="M620 70 C590 50, 570 75, 605 95 Z" fill="#65a30d" />
          <path d="M490 35 C455 20, 440 45, 475 65 Z" fill="#84cc16" />
          <path d="M400 80 C365 65, 350 90, 385 110 Z" fill="#65a30d" />
          <path d="M270 75 C235 60, 220 85, 255 105 Z" fill="#84cc16" />
          <path d="M140 120 C105 105, 90 130, 125 150 Z" fill="#65a30d" />
          <path d="M460 140 C425 125, 410 150, 445 170 Z" fill="#84cc16" />
          <path d="M260 200 C225 185, 210 210, 245 230 Z" fill="#65a30d" />
          <path d="M630 240 C600 220, 585 245, 615 265 Z" fill="#84cc16" />
          <path d="M650 380 C620 360, 605 385, 635 405 Z" fill="#65a30d" />
          <path d="M70 160 C40 145, 25 170, 55 190 Z" fill="#84cc16" />

          {/* Hanging Lucky Red Ribbons & Gold Coins */}
          <g transform="translate(370, 50)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="0" cy="28" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <line x1="0" y1="33" x2="0" y2="46" stroke="#dc2626" strokeWidth="2" strokeDasharray="2 1" />
          </g>
          <g transform="translate(190, 105)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="0" cy="24" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>

          {/* 18+ Abundant Golden Apricot Blossoms (Hoa Mai Vàng Phú Quý) */}
          {/* Flower 1 - Master Overhead Blossom */}
          <g transform="translate(470, 30)">
            <circle cx="0" cy="0" r="30" fill="url(#goldAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-15 -30, 15 -30, 0 0"
                fill="#facc15"
                stroke="#fef08a"
                strokeWidth="1.4"
                transform={`rotate(${angle}) scale(1.65)`}
              />
            ))}
            <circle cx="0" cy="0" r="7.5" fill="#ea580c" />
            <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
          </g>

          {/* Flower 2 - Upper Right Branch */}
          <g transform="translate(590, 120)">
            <circle cx="0" cy="0" r="26" fill="url(#goldAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-14 -28, 14 -28, 0 0"
                fill="#eab308"
                stroke="#fef08a"
                strokeWidth="1.3"
                transform={`rotate(${angle + 25}) scale(1.5)`}
              />
            ))}
            <circle cx="0" cy="0" r="7" fill="#c2410c" />
            <circle cx="0" cy="0" r="3" fill="#fef08a" />
          </g>

          {/* Flower 3 - Top Mid Canopy */}
          <g transform="translate(280, 70)">
            <circle cx="0" cy="0" r="25" fill="url(#goldAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-13 -26, 13 -26, 0 0"
                fill="#facc15"
                stroke="#fef08a"
                strokeWidth="1.2"
                transform={`rotate(${angle + 12}) scale(1.45)`}
              />
            ))}
            <circle cx="0" cy="0" r="6.5" fill="#ea580c" />
            <circle cx="0" cy="0" r="3" fill="#fef08a" />
          </g>

          {/* Flower 4 - Far Left Canopy Tip */}
          <g transform="translate(100, 140)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-12 -24, 12 -24, 0 0"
                fill="#fde047"
                stroke="#fef08a"
                strokeWidth="1"
                transform={`rotate(${angle + 30}) scale(1.35)`}
              />
            ))}
            <circle cx="0" cy="0" r="5.5" fill="#c2410c" />
          </g>

          {/* Flower 5 - Far Top-Left Tip */}
          <g transform="translate(10, 195)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#facc15"
                transform={`rotate(${angle + 40}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#ea580c" />
          </g>

          {/* Flower 6 - Mid Fork Hanging */}
          <g transform="translate(330, 170)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-12 -24, 12 -24, 0 0"
                fill="#eab308"
                transform={`rotate(${angle + 18}) scale(1.35)`}
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#ea580c" />
          </g>

          {/* Flower 7 - Mid Fork Tip */}
          <g transform="translate(160, 290)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#facc15"
                transform={`rotate(${angle + 50}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#c2410c" />
          </g>

          {/* Flower 8 - Right Margin Cascade (Upper) */}
          <g transform="translate(570, 270)">
            <circle cx="0" cy="0" r="22" fill="url(#goldAura)" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-12 -24, 12 -24, 0 0"
                fill="#facc15"
                transform={`rotate(${angle}) scale(1.35)`}
              />
            ))}
            <circle cx="0" cy="0" r="5.5" fill="#ea580c" />
          </g>

          {/* Flower 9 - Right Margin Cascade (Mid) */}
          <g transform="translate(590, 390)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#eab308"
                transform={`rotate(${angle + 33}) scale(1.3)`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#ea580c" />
          </g>

          {/* Flower 10 - Right Margin Cascade (Lower) */}
          <g transform="translate(645, 520)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#facc15"
                transform={`rotate(${angle + 5}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#c2410c" />
          </g>

          {/* Flower 11 - Top-most Canopy Tip */}
          <g transform="translate(190, 35)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#fde047"
                transform={`rotate(${angle + 15}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#ea580c" />
          </g>

          {/* Flower 12 - Outer Right Branch */}
          <g transform="translate(675, 340)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-11 -22, 11 -22, 0 0"
                fill="#facc15"
                transform={`rotate(${angle + 45}) scale(1.25)`}
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#c2410c" />
          </g>

          {/* Flower 13 - Far Upper Corner */}
          <g transform="translate(50, 95)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0 0 C-10 -20, 10 -20, 0 0"
                fill="#eab308"
                transform={`rotate(${angle + 20}) scale(1.2)`}
              />
            ))}
            <circle cx="0" cy="0" r="4" fill="#ea580c" />
          </g>

          {/* 16+ Plentiful Golden Buds */}
          <circle cx="550" cy="70" r="8.5" fill="#facc15" stroke="#fef08a" strokeWidth="1.3" />
          <circle cx="410" cy="40" r="8" fill="#eab308" />
          <circle cx="320" cy="60" r="7.5" fill="#facc15" />
          <circle cx="230" cy="85" r="8" fill="#facc15" />
          <circle cx="130" cy="80" r="7.5" fill="#eab308" />
          <circle cx="250" cy="160" r="8" fill="#facc15" />
          <circle cx="200" cy="230" r="7.5" fill="#fde047" />
          <circle cx="560" cy="210" r="8" fill="#facc15" />
          <circle cx="580" cy="330" r="8" fill="#eab308" />
          <circle cx="620" cy="440" r="7.5" fill="#facc15" />
          <circle cx="690" cy="460" r="7" fill="#eab308" />
          <circle cx="660" cy="260" r="7.5" fill="#facc15" />

          <defs>
            <radialGradient id="goldAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* 3. PROMINENT RED SILK COUPLETS (ĐÔI CÂU ĐỐI ĐỎ SƠN SON THIẾP VÀNG) */}
      {/* Positioned on outer edges, framed cleanly by flowers */}
      {/* ========================================================= */}
      {showCouplets && (
        <>
          {/* Left Couplet Scroll: XUÂN AN KHANG THỊNH VƯỢNG PHÁT TÀI */}
          <div className="flex flex-col items-center absolute left-1 sm:left-2.5 md:left-4 lg:left-6 top-20 sm:top-24 md:top-28 lg:top-32 z-30 transition-all drop-shadow-2xl scale-75 sm:scale-90 md:scale-100 origin-top">
            {/* Top Hanging Ring */}
            <div className="w-1 h-6 sm:h-8 bg-amber-500 shadow-sm" />
            <div className="w-12 sm:w-16 h-3 rounded-t-sm bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 shadow-md border-b border-amber-600" />

            {/* Red Silk Banner */}
            <div className="w-10 sm:w-14 py-3 sm:py-5 rounded-sm bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] border-x-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center space-y-2 sm:space-y-3 relative overflow-hidden">
              <div className="text-[10px] text-amber-300 font-bold">🌸</div>
              {'XUÂN AN KHANG THỊNH VƯỢNG PHÁT TÀI'.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="text-[11px] sm:text-sm font-extrabold tracking-widest text-amber-200 font-serif drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {word}
                </span>
              ))}
              <div className="text-[10px] text-amber-300 font-bold">🌸</div>
            </div>

            {/* Bottom Wood Roller & Golden Tassel */}
            <div className="w-12 sm:w-16 h-3 rounded-b-sm bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 shadow-md" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-yellow-200 mt-0.5 shadow-xs" />
            <div className="w-3.5 sm:w-4 h-10 sm:h-12 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-sm shadow-md" />
          </div>

          {/* Right Couplet Scroll: TẾT VẠN SỰ NHƯ Ý CÁT TƯỜNG */}
          <div className="flex flex-col items-center absolute right-1 sm:right-2.5 md:right-4 lg:right-6 top-20 sm:top-24 md:top-28 lg:top-32 z-30 transition-all drop-shadow-2xl scale-75 sm:scale-90 md:scale-100 origin-top">
            {/* Top Hanging Ring */}
            <div className="w-1 h-6 sm:h-8 bg-amber-500 shadow-sm" />
            <div className="w-12 sm:w-16 h-3 rounded-t-sm bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 shadow-md border-b border-amber-600" />

            {/* Red Silk Banner */}
            <div className="w-10 sm:w-14 py-3 sm:py-5 rounded-sm bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] border-x-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center space-y-2 sm:space-y-3 relative overflow-hidden">
              <div className="text-[10px] text-amber-300 font-bold">🧧</div>
              {'TẾT VẠN SỰ NHƯ Ý CÁT TƯỜNG'.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="text-[11px] sm:text-sm font-extrabold tracking-widest text-amber-200 font-serif drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {word}
                </span>
              ))}
              <div className="text-[10px] text-amber-300 font-bold">🧧</div>
            </div>

            {/* Bottom Wood Roller & Golden Tassel */}
            <div className="w-12 sm:w-16 h-3 rounded-b-sm bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-700 shadow-md" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-yellow-200 mt-0.5 shadow-xs" />
            <div className="w-3.5 sm:w-4 h-10 sm:h-12 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 rounded-b-sm shadow-md" />
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 4. BOTTOM CORNERS: SPRING BLOSSOMS & GOLDEN INGOTS */}
      {/* ========================================================= */}
      {/* Bottom Left Bush */}
      <div className="absolute -bottom-6 -left-6 w-48 sm:w-64 h-48 sm:h-64 opacity-90 pointer-events-none drop-shadow-lg">
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <path d="M20 260 C70 200, 130 190, 170 210 Z" fill="#65a30d" opacity="0.85" />
          <path d="M50 270 C100 210, 160 220, 190 240 Z" fill="#84cc16" opacity="0.8" />
          <g transform="translate(100, 210) scale(1.3)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path key={i} d="M0 0 C-10 -20, 10 -20, 0 0" fill="#f43f5e" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r="5" fill="#fef08a" />
          </g>
          <g transform="translate(160, 230) scale(1.1)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path key={i} d="M0 0 C-10 -20, 10 -20, 0 0" fill="#fb7185" transform={`rotate(${angle + 20})`} />
            ))}
            <circle cx="0" cy="0" r="4" fill="#fef08a" />
          </g>
          <ellipse cx="60" cy="250" rx="14" ry="7" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="60" cy="250" r="3" fill="#ca8a04" />
        </svg>
      </div>

      {/* Bottom Right Bush */}
      <div className="absolute -bottom-6 -right-6 w-48 sm:w-64 h-48 sm:h-64 opacity-90 pointer-events-none drop-shadow-lg">
        <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
          <path d="M260 260 C210 200, 150 190, 110 210 Z" fill="#65a30d" opacity="0.85" />
          <path d="M230 270 C180 210, 120 220, 90 240 Z" fill="#84cc16" opacity="0.8" />
          <g transform="translate(180, 210) scale(1.3)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path key={i} d="M0 0 C-10 -20, 10 -20, 0 0" fill="#facc15" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r="5" fill="#ea580c" />
          </g>
          <g transform="translate(120, 230) scale(1.1)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path key={i} d="M0 0 C-10 -20, 10 -20, 0 0" fill="#fde047" transform={`rotate(${angle + 20})`} />
            ))}
            <circle cx="0" cy="0" r="4" fill="#ea580c" />
          </g>
          <ellipse cx="220" cy="250" rx="14" ry="7" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="220" cy="250" r="3" fill="#ca8a04" />
        </svg>
      </div>

      {/* Global Style for Swaying Branches */}
      <style>{`
        @keyframes swayLeftBranch {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(2deg) scale(1.02); }
        }
        @keyframes swayRightBranch {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(-2deg) scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default TetFloralBorders;
