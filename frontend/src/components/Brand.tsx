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
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white shadow-xs border border-slate-200/80">
        <img
          src={neuLogo}
          alt="Logo Đại học Kinh tế Quốc dân"
          className="w-8 h-8 object-contain"
        />
      </div>
      {!isCollapsed && (
        <div className="min-w-0 flex flex-col">
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight truncate">
            {t.appName}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#1461a4] dark:text-sky-400 font-mono leading-none mt-0.5 truncate">
            {t.subBrand}
          </span>
        </div>
      )}
    </div>
  );
};

export default Brand;
