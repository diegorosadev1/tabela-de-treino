import React from 'react';
import { Exercise, ExerciseLog } from '../types/workout';
import { Check, Timer, Plus, Minus } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  currentRir: string; // e.g. "2–3" or "1–2" based on week
  log: ExerciseLog;
  onUpdateLog: (partial: Partial<ExerciseLog>) => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  currentRir,
  log,
  onUpdateLog,
  onStartRestTimer,
}) => {
  const isCompleted = log.completed;

  const handleToggleComplete = () => {
    onUpdateLog({ completed: !isCompleted });
  };

  const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateLog({ loadKg: e.target.value });
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateLog({ repsDone: e.target.value });
  };

  // Steppers for quick mobile adjustment
  const adjustLoad = (delta: number) => {
    const current = parseFloat(log.loadKg) || 0;
    const next = Math.max(0, current + delta);
    onUpdateLog({ loadKg: next === 0 ? '' : String(next) });
  };

  const adjustReps = (delta: number) => {
    const current = parseInt(log.repsDone, 10) || 0;
    const next = Math.max(0, current + delta);
    onUpdateLog({ repsDone: next === 0 ? '' : String(next) });
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isCompleted
          ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
          : 'bg-white border-stone-200 shadow-xs hover:border-stone-300'
      }`}
    >
      {/* Top Banner & Number */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span
              className={`text-xs font-mono font-bold tracking-wider ${
                isCompleted ? 'text-emerald-700' : 'text-stone-400'
              }`}
            >
              {exercise.number}
            </span>
            <h4
              className={`text-base sm:text-lg font-bold uppercase tracking-tight mt-0.5 ${
                isCompleted ? 'text-emerald-950' : 'text-stone-900'
              }`}
            >
              {exercise.name}
            </h4>
            <div className="text-xs text-stone-500 mt-0.5">
              Foco: {exercise.muscleFocus}
            </div>
          </div>

          {/* Quick complete badge indicator */}
          {isCompleted && (
            <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Concluído</span>
            </span>
          )}
        </div>

        {/* Prescription Metadata (Sets, Reps, Rest, RIR) */}
        <div className="mt-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Séries × Repetições</span>
            <span className="font-bold text-stone-900 text-sm">
              {exercise.sets} séries × {exercise.reps}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Descanso</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-800">{exercise.restTime}</span>
              <button
                type="button"
                onClick={() => onStartRestTimer(exercise.restSeconds, exercise.name)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-medium transition-colors"
                title="Iniciar cronômetro de descanso"
              >
                <Timer className="w-3 h-3 text-rose-600" />
                <span>Timer</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">RIR (Repetições em Reserva)</span>
            <span className="font-semibold text-rose-600 font-mono">
              {currentRir}
            </span>
          </div>
        </div>

        {/* Inputs: Carga & Repetições */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Carga */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-600">
              Carga (kg)
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustLoad(-2.5)}
                className="h-11 w-10 shrink-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold active:scale-95 transition-colors border border-stone-200"
                aria-label="Diminuir 2.5 kg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="Ex: 40"
                  value={log.loadKg || ''}
                  onChange={handleLoadChange}
                  className="w-full h-11 px-3 pr-8 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white focus:outline-none text-stone-900 font-semibold text-sm tabular-nums transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium pointer-events-none">
                  kg
                </span>
              </div>
              <button
                type="button"
                onClick={() => adjustLoad(2.5)}
                className="h-11 w-10 shrink-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold active:scale-95 transition-colors border border-stone-200"
                aria-label="Aumentar 2.5 kg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Repetições realizadas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-600">
              Repetições Realizadas
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustReps(-1)}
                className="h-11 w-10 shrink-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold active:scale-95 transition-colors border border-stone-200"
                aria-label="Diminuir 1 repetição"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={exercise.reps}
                  value={log.repsDone || ''}
                  onChange={handleRepsChange}
                  className="w-full h-11 px-3 pr-8 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white focus:outline-none text-stone-900 font-semibold text-sm tabular-nums transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-medium pointer-events-none">
                  reps
                </span>
              </div>
              <button
                type="button"
                onClick={() => adjustReps(1)}
                className="h-11 w-10 shrink-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold active:scale-95 transition-colors border border-stone-200"
                aria-label="Aumentar 1 repetição"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Checkbox de Concluído - Big mobile touch friendly row */}
        <div className="mt-4 pt-3 border-t border-stone-200/80">
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-center gap-3 px-4 py-3 transition-all active:scale-[0.98] ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium border border-stone-200'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                isCompleted
                  ? 'bg-white text-emerald-600 border-white'
                  : 'bg-white text-transparent border-stone-300'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-sm">
              {isCompleted ? 'Exercício Concluído!' : 'Marcar como Concluído'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
