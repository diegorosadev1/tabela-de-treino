import React from 'react';
import { WEEKLY_SCHEDULE, DayScheduleItem } from '../data/workoutData';
import { ChevronRight, Dumbbell, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface WeeklyScheduleProps {
  onSelectWorkout: (workoutId: 'A' | 'B' | 'C') => void;
  completedWorkoutsThisWeek?: Record<'A' | 'B' | 'C', boolean>;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  onSelectWorkout,
  completedWorkoutsThisWeek = { A: false, B: false, C: false },
}) => {
  // Current Day in JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const todayDayIndex = new Date().getDay();

  // Find today's item
  const todayItem = WEEKLY_SCHEDULE.find((item) => item.dayIndex === todayDayIndex);

  return (
    <div className="space-y-4">
      {/* Today's Action Banner */}
      {todayItem && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-200/80 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hoje é {todayItem.fullName}</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>{todayItem.iconText}</span>
                <span>{todayItem.title}</span>
              </h3>
              <p className="text-xs text-stone-600">
                {todayItem.subtitle}
              </p>
            </div>

            {todayItem.workoutId ? (
              <button
                onClick={() => onSelectWorkout(todayItem.workoutId!)}
                className="shrink-0 h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>Abrir Treino</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="shrink-0 text-center px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
                {todayItem.activityType === 'boxe' ? 'Dia de Boxe' : 'Descanso ativo'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Week Grid / List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Programação da Semana
          </h3>
          <span className="text-[11px] text-stone-400">
            Toque nos treinos para abrir
          </span>
        </div>

        <div className="grid gap-2">
          {WEEKLY_SCHEDULE.map((item: DayScheduleItem) => {
            const isToday = item.dayIndex === todayDayIndex;
            const isClickable = Boolean(item.workoutId);
            const isDone = item.workoutId ? completedWorkoutsThisWeek[item.workoutId] : false;

            return (
              <div
                key={item.dayIndex}
                onClick={() => {
                  if (item.workoutId) onSelectWorkout(item.workoutId);
                }}
                className={`relative flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                  isClickable ? 'cursor-pointer active:scale-[0.99]' : ''
                } ${
                  isToday
                    ? 'bg-rose-50/70 border-2 border-rose-400/80 shadow-xs'
                    : 'bg-white border border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Day Badge */}
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-colors ${
                      isToday
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    <span className="text-[10px] leading-tight">{item.shortName}</span>
                    <span className="text-sm leading-none mt-0.5">{item.iconText}</span>
                  </div>

                  {/* Day info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">
                        {item.title}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200/80 text-rose-800">
                          HOJE
                        </span>
                      )}
                      {isDone && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Feito</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right affordance */}
                {isClickable ? (
                  <div className="flex items-center gap-1 text-stone-400 group-hover:text-stone-700">
                    <span className="text-xs font-medium text-stone-500 hidden sm:inline">Ver ficha</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                ) : (
                  <span className="text-xs text-stone-400 pr-1">
                    {item.activityType === 'boxe' ? '🥊 Boxe' : 'Descanso'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
