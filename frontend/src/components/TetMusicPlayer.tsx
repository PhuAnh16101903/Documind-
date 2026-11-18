import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles, X } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface TetMusicPlayerProps {
  lang?: Language;
  onAutoPlayed?: () => void;
}

export const TetMusicPlayer: React.FC<TetMusicPlayerProps> = ({
  lang = 'vi',
}) => {
  const t = translations[lang];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio('/tet_music.mp3');
    audio.loop = false; // CRITICAL: NEVER LOOP ("k lặp lại")
    audio.volume = volume;
    audioRef.current = audio;

    // Handle end of playback
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
          // Browser autoplay policy blocked unmuted sound without user gesture
          setAutoplayBlocked(true);
          setIsPlaying(false);

          // Listen for first interaction anywhere on page
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

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-rose-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-amber-300"
        title={t.tetMusicTrack}
      >
        <Music className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <aside
      aria-label={t.tetMusicTrack}
      className="fixed bottom-5 right-5 z-40 max-w-sm rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-400/80 dark:border-amber-500/60 shadow-2xl p-3.5 space-y-2.5 animate-slide-up select-none font-sans"
    >
      {/* Header bar with holiday decoration */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-amber-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-red-600 dark:text-red-400 flex items-center gap-1">
              <span>🌸</span>
              <span>{t.tetBadge}</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300">
                {lang === 'vi' ? 'Không lặp lại' : 'No Loop'}
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[190px]">
              {t.tetMusicTrack}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
          title={t.closeButton}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Autoplay prompt alert if blocked by browser policy */}
      {autoplayBlocked && !isPlaying && !hasEnded && (
        <button
          onClick={togglePlay}
          className="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>{t.tetMusicClickToPlay}</span>
        </button>
      )}

      {/* Playback Controls & Waveform */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md active:scale-90 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center transition-colors"
            title={isMuted ? 'Bật âm' : 'Tắt tiếng'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Volume slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 accent-amber-500 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Equalizer animation bars */}
        <div className="flex items-end gap-1 h-5 px-2">
          <div
            className={`w-1 bg-red-500 rounded-full transition-all duration-150 ${
              isPlaying ? 'h-5 animate-pulse' : 'h-1.5 opacity-40'
            }`}
          />
          <div
            className={`w-1 bg-amber-500 rounded-full transition-all duration-200 ${
              isPlaying ? 'h-3 animate-bounce' : 'h-1 opacity-40'
            }`}
          />
          <div
            className={`w-1 bg-red-600 rounded-full transition-all duration-100 ${
              isPlaying ? 'h-4 animate-pulse' : 'h-2 opacity-40'
            }`}
          />
          <div
            className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-5 animate-bounce' : 'h-1.5 opacity-40'
            }`}
          />
        </div>
      </div>

      {/* Completion message */}
      {hasEnded && (
        <div className="text-[10px] text-center font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 rounded-lg py-1 border border-amber-200 dark:border-amber-900">
          ✨ {lang === 'vi' ? 'Đã hoàn tất phát nhạc Tết 1 lần' : 'Finished playing Tết melody'}
        </div>
      )}
    </aside>
  );
};
