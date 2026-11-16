import React from 'react';
import {
  X,
  Palette,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Shield,
  Layers,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { UIThemeId } from '../types';
import { THEMES } from '../theme/themes';

interface ThemeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: UIThemeId;
  onSelectTheme: (id: UIThemeId) => void;
}

export const ThemeInspectorModal: React.FC<ThemeInspectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const themesData = [
    {
      id: 'evondev' as const,
      url: 'https://evondev-uiux.vercel.app/#showcase',
      features: [
        'Wireframe-first & Bento Grids hiện đại',
        'Viền card gradient phát sáng & ambient glow',
        'Command palette với phím tắt Ctrl + K nổi bật',
        'Các thẻ trạng thái sinh động, trực quan',
      ],
    },
    {
      id: 'impeccable' as const,
      url: 'https://github.com/pbakaus/impeccable',
      features: [
        'Chuẩn Craft tối giản đẳng cấp Linear / Apple (110k+ ⭐)',
        'Đường viền hairline 1px siêu nét, triệt tiêu visual slop',
        'Khoảng cách chuẩn nhịp điệu 4/8pt và phông số monospace tinh tế',
        'Màu sắc đen chì graphite với độ tương phản typography sắc sảo',
      ],
    },
    {
      id: 'huashu' as const,
      url: 'https://github.com/alchaincyf/huashu-design',
      features: [
        'Hệ thống HTML-native Design Tokens phong cách Á Đông (29k+ ⭐)',
        'Lưới dữ liệu phẳng, ngăn nắp, độ đọc cao',
        'Thẻ badge ngữ nghĩa phân loại phòng ban rõ ràng',
        'Trạng thái nút và tab chuyển tiếp êm ái, tối ưu hiệu năng',
      ],
    },
    {
      id: 'vibe' as const,
      url: 'https://github.com/teddiesloco/vibe-design-harness',
      features: [
        'Kiến trúc 5 trụ cột Cyber-Obsidian AI SaaS (40+ Gates)',
        'Ánh sáng nền radial chuyển động 60fps mượt mà',
        'Kính mờ viễn tưởng holographic với viền dạ quang tím/neon',
        'Trực quan hóa radar kiểm định và con dấu bảo mật SHA-256',
      ],
    },
    {
      id: 'promax' as const,
      url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
      features: [
        'Hệ cơ sở dữ liệu Design Intelligence đồ sộ (150k+ ⭐)',
        'Quy tắc vàng 60-30-10 cân bằng thị giác tuyệt đối',
        'Độ tương phản đạt tiêu chuẩn tiếp cận WCAG AAA',
        'Thẻ trích dẫn kiểm chứng tương tác, chuyển đổi Bento Grid & Table 1-click',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#090e1a] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/60 select-none">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Palette className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Bảng So Sánh 5 Thiết Kế UX/UI Chuẩn Hóa
              </h3>
              <p className="text-xs text-slate-400">
                DocuMind đã tích hợp toàn bộ 5 phong cách thiết kế từ các nguồn tham khảo của bạn.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themesData.map((item, idx) => {
              const theme = THEMES[item.id];
              const isSelected = currentTheme === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/90 border-indigo-500/50 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                        <h4 className="font-extrabold text-sm text-white">
                          {idx + 1}. {theme.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {theme.stars || theme.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">{theme.tagline}</p>

                    <div className="space-y-1.5 pt-1">
                      {item.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-start gap-2 text-xs text-slate-400"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Xem nguồn gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => {
                        onSelectTheme(item.id);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      }`}
                    >
                      {isSelected ? 'Đang kích hoạt' : 'Áp dụng phong cách này'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-950/70 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Click vào bất kỳ phong cách nào để chuyển đổi trực tiếp trên website.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
