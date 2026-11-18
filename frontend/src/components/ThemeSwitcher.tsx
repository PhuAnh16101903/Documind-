import React, { useState } from 'react';
import { Palette, Sparkles, Check, Info, ChevronDown, ExternalLink } from 'lucide-react';
import { UIThemeId } from '../types';
import { THEMES } from '../theme/themes';

interface ThemeSwitcherProps {
  currentTheme: UIThemeId;
  onSelectTheme: (themeId: UIThemeId) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const active = THEMES[currentTheme];

  return (
    <div className="relative">
      {/* Active Theme Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/[0.1] text-xs font-medium text-slate-200 transition-all duration-200 shadow-sm group active:scale-95"
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: active.accentColor }}
        />
        <span className="font-semibold">{active.name}</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
          {active.badge}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e1424] border border-white/[0.12] shadow-2xl p-3 z-50 animate-fade-in backdrop-blur-xl">
            <div className="px-3 py-2 border-b border-white/[0.08] mb-2">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  <span>Chọn Hệ Thống Giao Diện • 5 Mẫu Thiết Kế</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Live Switcher</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Bấm vào từng phong cách để áp dụng ngay lên toàn bộ ứng dụng DocuMind.
              </p>
            </div>

            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {(Object.keys(THEMES) as UIThemeId[]).map((id) => {
                const theme = THEMES[id];
                const isSelected = currentTheme === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      onSelectTheme(id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-start justify-between group ${
                      isSelected
                        ? 'bg-white/10 border border-white/20 shadow-sm'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {theme.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/[0.06]">
                            {theme.author}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {theme.tagline}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-white/[0.08] px-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Chuẩn hoá từ 5 Repositories &amp; Showcases</span>
              <span className="text-emerald-400 font-bold">100% Zero-Slop</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
