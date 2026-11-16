import React, { useState } from 'react';
import { Palette, Info, Check, ExternalLink, Sparkles, BookOpen, Layers } from 'lucide-react';
import { UIThemeId } from '../types';
import { THEMES } from '../theme/themes';
import { ThemeInspectorModal } from './ThemeInspectorModal';

interface ThemePillBarProps {
  currentTheme: UIThemeId;
  onSelectTheme: (themeId: UIThemeId) => void;
}

export const ThemePillBar: React.FC<ThemePillBarProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const activeTheme = THEMES[currentTheme];

  const themeList = Object.keys(THEMES) as UIThemeId[];

  return (
    <>
      <div className="h-11 border-b border-white/[0.08] bg-[#070b14]/90 backdrop-blur-md px-5 flex items-center justify-between z-20 select-none overflow-x-auto gap-4">
        {/* Left: Quick Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-nowrap">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mr-2 flex-shrink-0 font-bold">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">GIAO DIỆN:</span>
          </span>

          {themeList.map((id, index) => {
            const theme = THEMES[id];
            const isSelected = currentTheme === id;
            return (
              <button
                key={id}
                onClick={() => onSelectTheme(id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? `${theme.activePillClass} font-bold shadow-sm`
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span>
                  {index + 1}. {theme.name}
                </span>
                {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Right: Active Tagline & Inspector Modal Trigger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="text-white font-semibold">Đang áp dụng:</span>
            <span className="text-slate-300 truncate max-w-sm">{activeTheme.tagline}</span>
          </div>

          <button
            onClick={() => setIsInspectorOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>So Sánh 5 Thiết Kế</span>
          </button>
        </div>
      </div>

      {/* Inspector Modal */}
      <ThemeInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
      />
    </>
  );
};
