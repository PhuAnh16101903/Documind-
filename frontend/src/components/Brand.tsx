import React from 'react';
import neuLogo from '../assets/neu-logo.png';
import { Language, translations } from '../services/i18n';

interface BrandProps {
  className?: string;
  isCollapsed?: boolean;
  lang?: Language;
  variant?: 'light' | 'dark' | 'auto';
}

export const Brand: React.FC<BrandProps> = ({
  className = '',
  isCollapsed = false,
  lang = 'vi',
}) => {
  const t = translations[lang];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Authentic Circular NEU Emblem with sleek glowing ring */}
      <div className="relative group flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-md shadow-blue-900/10 border border-blue-100 dark:border-slate-700/80 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20">
          <img
            src={neuLogo}
            alt="Logo Đại học Kinh tế Quốc dân"
            className="w-8 h-8 object-contain drop-shadow-xs"
          />
        </div>
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 -z-10 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {!isCollapsed && (
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              Docu<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mind</span>
            </span>
            <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 uppercase tracking-wider">
              PRO
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#1461a4] dark:text-sky-400 font-mono leading-none mt-1 truncate">
            {t.subBrand}
          </span>
        </div>
      )}
    </div>
  );
};

export default Brand;
