import React from 'react';
import { Exercise, ExerciseLog } from '../types/workout';
import { Check, Timer } from 'lucide-react';

interface ExerciseRowProps {
  exercise: Exercise;
  currentRir: string;
  log: ExerciseLog;
  onUpdateLog: (partial: Partial<ExerciseLog>) => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({
  exercise,
  currentRir,
  log,
  onUpdateLog,
  onStartRestTimer,
}) => {
  const isCompleted = log.completed;

  return (
    <tr
      className={`border-b border-stone-200 transition-colors ${
        isCompleted ? 'bg-emerald-50/50' : 'hover:bg-stone-50/80 bg-white'
      }`}
    >
      {/* Number */}
      <td className="py-4 px-4 text-xs font-mono font-bold text-stone-400">
        {exercise.number}
      </td>

      {/* Exercise Name & Muscle */}
      <td className="py-4 px-4">
        <div className="font-bold text-stone-900 uppercase text-sm">
          {exercise.name}
        </div>
        <div className="text-xs text-stone-500">
          {exercise.muscleFocus}
        </div>
      </td>

      {/* Sets & Reps */}
      <td className="py-4 px-4 text-sm font-semibold text-stone-800 whitespace-nowrap">
        {exercise.sets} × {exercise.reps}
      </td>

      {/* Rest Time */}
      <td className="py-4 px-4 text-xs text-stone-600 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span>{exercise.restTime}</span>
          <button
            type="button"
            onClick={() => onStartRestTimer(exercise.restSeconds, exercise.name)}
            className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Iniciar descanso"
          >
            <Timer className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>
      </td>

      {/* RIR */}
      <td className="py-4 px-4 text-xs font-mono font-semibold text-rose-600 whitespace-nowrap">
        {currentRir}
      </td>

      {/* Carga */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="relative inline-block w-24">
          <input
            type="number"
            step="any"
            placeholder="0"
            value={log.loadKg || ''}
            onChange={(e) => onUpdateLog({ loadKg: e.target.value })}
            className="w-full h-9 px-2.5 pr-7 text-xs font-semibold rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-500 focus:outline-none"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 pointer-events-none">
            kg
          </span>
        </div>
      </td>

      {/* Repetições realizadas */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="relative inline-block w-24">
          <input
            type="number"
            placeholder={exercise.reps}
            value={log.repsDone || ''}
            onChange={(e) => onUpdateLog({ repsDone: e.target.value })}
            className="w-full h-9 px-2.5 pr-8 text-xs font-semibold rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-500 focus:outline-none"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 pointer-events-none">
            reps
          </span>
        </div>
      </td>

      {/* Concluído Checkbox */}
      <td className="py-4 px-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={() => onUpdateLog({ completed: !isCompleted })}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
            isCompleted
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
          }`}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border ${
              isCompleted ? 'bg-white text-emerald-600 border-white' : 'border-stone-300'
            }`}
          >
            {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>{isCompleted ? 'Feito' : 'Concluir'}</span>
        </button>
      </td>
    </tr>
  );
};
