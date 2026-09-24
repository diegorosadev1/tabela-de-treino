import React from 'react';
import { Dumbbell, Calendar, Timer } from 'lucide-react';

interface HeaderProps {
  currentWeek: number;
  onOpenWeekSelector: () => void;
  onToggleTimer: () => void;
  activeTimerOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeek,
  onOpenWeekSelector,
  onToggleTimer,
  activeTimerOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base shadow-xs border border-rose-100">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900">
            Meu Treino
          </span>
        </div>

        {/* Zone 2: Week selector trigger */}
        <button
          onClick={onOpenWeekSelector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-xs font-semibold text-stone-800 transition-colors active:scale-95 border border-stone-200"
          aria-label="Selecionar semana de treino"
        >
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span>Semana {currentWeek} de 6</span>
        </button>

        {/* Zone 3: Quick Rest Timer toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTimer}
            className={`p-2 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
              activeTimerOpen
                ? 'bg-rose-100 text-rose-700'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
            }`}
            title="Temporizador de descanso"
            aria-label="Abrir temporizador"
          >
            <Timer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
