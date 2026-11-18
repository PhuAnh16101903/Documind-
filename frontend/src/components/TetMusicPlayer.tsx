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

  // Headless audio player: plays in background once, no loop, completely hidden from visual UI
  return null;
};
