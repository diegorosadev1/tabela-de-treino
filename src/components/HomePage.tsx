import React from 'react';
import { WeeklySchedule } from './WeeklySchedule';
import { WEEK_GUIDELINES } from '../data/workoutData';
import { Calendar, Dumbbell, Flame, Sparkles, ChevronRight, Info } from 'lucide-react';

interface HomePageProps {
  currentWeek: number;
  onOpenWeekSelector: () => void;
  onSelectWorkout: (workoutId: 'A' | 'B' | 'C') => void;
  completedWorkoutsThisWeek: Record<'A' | 'B' | 'C', boolean>;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentWeek,
  onOpenWeekSelector,
  onSelectWorkout,
  completedWorkoutsThisWeek,
}) => {
  const currentWeekGuideline = WEEK_GUIDELINES.find((g) => g.week === currentWeek) || WEEK_GUIDELINES[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs relative overflow-hidden">
        {/* Subtle decorative gradient glow */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-rose-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
              Plano de 6 semanas
            </span>

            <button
              onClick={onOpenWeekSelector}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 active:scale-95 transition-colors"
            >
              <span>Semana {currentWeek}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Meu Treino
          </h1>

          {/* Key metrics / structure: unboxed clean metadata with bullets */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-stone-700 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
              🏋️ 3x musculação por semana
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
              🥊 2x boxe por semana
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
              📅 6 semanas
            </span>
          </div>

          {/* Short motivational focus phrase */}
          <p className="text-sm font-medium text-stone-600 italic pt-1 border-t border-stone-100">
            &ldquo;Foco: força, consistência e preservação de massa muscular.&rdquo;
          </p>
        </div>
      </div>

      {/* Week Focus & Progression Guidance */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-sm tracking-wide">
              Foco da {currentWeekGuideline.label}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-rose-300 bg-stone-800 px-2 py-0.5 rounded-md border border-stone-700">
            RIR: {currentWeekGuideline.rir}
          </span>
        </div>

        <ul className="space-y-1.5 text-xs text-stone-300">
          {currentWeekGuideline.guidelines.map((text, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>

        <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800">
          <span>Descanso: 90–120s principais · 60–90s isolados</span>
          <button
            onClick={onOpenWeekSelector}
            className="text-rose-300 hover:text-white font-medium underline"
          >
            Ver todas as semanas
          </button>
        </div>
      </div>

      {/* Programação da Semana */}
      <WeeklySchedule
        onSelectWorkout={onSelectWorkout}
        completedWorkoutsThisWeek={completedWorkoutsThisWeek}
      />
    </div>
  );
};
