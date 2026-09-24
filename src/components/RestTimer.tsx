import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
  exerciseName,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setTotalSeconds(initialSeconds);
    if (isOpen) {
      setIsRunning(true);
    }
  }, [initialSeconds, isOpen]);

  // Audio chime using Web Audio API (works reliably on mobile without external asset files)
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio might be blocked without gesture or in iframe
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChime();
            if ('vibrate' in navigator) {
              try {
                navigator.vibrate([200, 100, 200]);
              } catch {
                // ignore
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  const handleSetPreset = (secs: number) => {
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setIsRunning(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-6 z-50 px-4 max-w-md mx-auto pointer-events-none">
      <div className="pointer-events-auto bg-stone-900/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-stone-800 p-4 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-medium text-stone-300">
              Descanso {exerciseName ? `· ${exerciseName}` : ''}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
            aria-label="Fechar temporizador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Timer display */}
        <div className="flex items-center justify-between my-2">
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight tabular-nums text-white">
              {formattedTime}
            </div>
            <p className="text-[11px] text-stone-400">
              {timeLeft === 0 ? 'Tempo de descanso concluído! Próxima série!' : 'Recupere a respiração'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="h-11 w-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
              aria-label={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setTimeLeft(totalSeconds);
                setIsRunning(false);
              }}
              className="h-11 w-11 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-all active:scale-95"
              aria-label="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden my-2">
          <div
            className="bg-rose-500 h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Presets */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Bell className="w-3 h-3" /> Ajustar:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleSetPreset(60)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                totalSeconds === 60 ? 'bg-stone-700 text-white' : 'bg-stone-800/80 text-stone-400 hover:text-white'
              }`}
            >
              60s
            </button>
            <button
              onClick={() => handleSetPreset(90)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                totalSeconds === 90 ? 'bg-stone-700 text-white' : 'bg-stone-800/80 text-stone-400 hover:text-white'
              }`}
            >
              90s
            </button>
            <button
              onClick={() => handleSetPreset(120)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                totalSeconds === 120 ? 'bg-stone-700 text-white' : 'bg-stone-800/80 text-stone-400 hover:text-white'
              }`}
            >
              120s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
