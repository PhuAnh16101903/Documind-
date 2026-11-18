import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface TetMusicPlayerProps {
  lang?: Language;
  onAutoPlayed?: () => void;
  className?: string;
}

export const TetMusicPlayer: React.FC<TetMusicPlayerProps> = ({
  lang = 'vi',
  className = '',
}) => {
  const t = translations[lang];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.6);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const audio = new Audio('/tet_music.mp3');
    audio.loop = false; // CRITICAL: NEVER LOOP ("k lặp lại")
    audio.volume = volume;
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
    };
    audio.addEventListener('ended', handleEnded);

    // Attempt autoplay immediately
    const startAudio = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
          hasStartedRef.current = true;
        })
        .catch(() => {
          setAutoplayBlocked(true);
          setIsPlaying(false);

          const onFirstInteraction = () => {
            if (!hasStartedRef.current && audioRef.current && !hasEnded) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setAutoplayBlocked(false);
                  hasStartedRef.current = true;
                })
                .catch(() => {});
            }
            window.removeEventListener('click', onFirstInteraction);
            window.removeEventListener('keydown', onFirstInteraction);
            window.removeEventListener('touchstart', onFirstInteraction);
          };

          window.addEventListener('click', onFirstInteraction, { once: true });
          window.addEventListener('keydown', onFirstInteraction, { once: true });
          window.addEventListener('touchstart', onFirstInteraction, { once: true });
        });
    };

    startAudio();

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (hasEnded) {
        audioRef.current.currentTime = 0;
        setHasEnded(false);
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
          hasStartedRef.current = true;
        })
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  // Sleek minimized floating pill
  if (isCollapsed) {
    return (
      <div
        className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-400/60 shadow-lg select-none transition-all hover:scale-105 cursor-pointer ${className}`}
        onClick={() => setIsCollapsed(false)}
        title={t.tetMusicTrack}
      >
        <span className="text-xs">🎵</span>
        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
          {isPlaying ? (lang === 'vi' ? 'Nhạc Tết đang phát' : 'Playing') : (lang === 'vi' ? 'Bật nhạc Tết' : 'Tết Music')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-7 h-7 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white flex items-center justify-center shadow-xs"
        >
          {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
        </button>
      </div>
    );
  }

  // Refined, sleek, compact glassmorphic player
  return (
    <aside
      aria-label={t.tetMusicTrack}
      className={`fixed bottom-4 right-4 z-40 flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-400/50 dark:border-amber-500/40 shadow-xl shadow-amber-900/10 select-none font-sans text-xs animate-slide-up ${className}`}
    >
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs active:scale-95 transition-all cursor-pointer ${
          isPlaying
            ? 'bg-gradient-to-tr from-amber-500 to-amber-600'
            : 'bg-gradient-to-tr from-red-600 to-rose-600'
        }`}
        title={isPlaying ? 'Tạm dừng' : 'Phát'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Song info and subtle badge */}
      <div className="flex flex-col pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-red-600 dark:text-red-400 font-extrabold text-[11px] flex items-center gap-1">
            <span>🌸</span>
            <span>{lang === 'vi' ? 'Nhạc Tết 2026' : 'Tết Music'}</span>
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
            {lang === 'vi' ? '1 lần' : 'No loop'}
          </span>
        </div>
        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-[170px] truncate">
          Ngày Tết Quê Em
        </div>
      </div>

      {/* Mini Equalizer Waves when playing */}
      <div className="flex items-end gap-0.5 h-4 px-1">
        <div
          className={`w-0.5 bg-red-500 rounded-full transition-all duration-150 ${
            isPlaying ? 'h-4 animate-pulse' : 'h-1 opacity-40'
          }`}
        />
        <div
          className={`w-0.5 bg-amber-500 rounded-full transition-all duration-200 ${
            isPlaying ? 'h-3 animate-bounce' : 'h-1.5 opacity-40'
          }`}
        />
        <div
          className={`w-0.5 bg-red-600 rounded-full transition-all duration-100 ${
            isPlaying ? 'h-3.5 animate-pulse' : 'h-1 opacity-40'
          }`}
        />
      </div>

      {/* Mute/Volume Toggle */}
      <button
        onClick={toggleMute}
        className="w-7 h-7 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        title={isMuted ? 'Bật âm' : 'Tắt tiếng'}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-red-500" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Collapse to mini button */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        title={t.closeButton}
      >
        <X className="w-3 h-3" />
      </button>
    </aside>
  );
};
