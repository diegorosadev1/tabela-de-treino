import React, { useState } from 'react';
import { Workout, ExerciseLog } from '../types/workout';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseRow } from './ExerciseRow';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';

interface WorkoutTableProps {
  workout: Workout;
  currentRir: string;
  logs: Record<string, ExerciseLog>;
  onUpdateExerciseLog: (exerciseId: string, partial: Partial<ExerciseLog>) => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
}

export const WorkoutTable: React.FC<WorkoutTableProps> = ({
  workout,
  currentRir,
  logs,
  onUpdateExerciseLog,
  onStartRestTimer,
}) => {
  const [desktopViewMode, setDesktopViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div className="space-y-4">
      {/* Desktop view switcher (cards or table) - hidden on mobile */}
      <div className="hidden md:flex items-center justify-between text-xs text-stone-500 pb-1">
        <span>Visualização:</span>
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button
            onClick={() => setDesktopViewMode('cards')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
              desktopViewMode === 'cards'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setDesktopViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
              desktopViewMode === 'table'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Stacked Cards (strict rule: no wide tables or horizontal scroll) */}
      <div className={`space-y-3.5 ${desktopViewMode === 'table' ? 'md:hidden' : 'grid grid-cols-1 md:grid-cols-2 gap-3.5 md:space-y-0'}`}>
        {workout.exercises.map((exercise) => {
          const log = logs[exercise.id] || { completed: false, loadKg: '', repsDone: '' };
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              currentRir={currentRir}
              log={log}
              onUpdateLog={(partial) => onUpdateExerciseLog(exercise.id, partial)}
              onStartRestTimer={onStartRestTimer}
            />
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW: rendered only on desktop when table view is active */}
      <div className={`hidden ${desktopViewMode === 'table' ? 'md:block' : ''}`}>
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Exercício</th>
                <th className="py-3 px-4">Séries × Reps</th>
                <th className="py-3 px-4">Descanso</th>
                <th className="py-3 px-4">RIR</th>
                <th className="py-3 px-4">Carga</th>
                <th className="py-3 px-4">Reps Feitas</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((exercise) => {
                const log = logs[exercise.id] || { completed: false, loadKg: '', repsDone: '' };
                return (
                  <ExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    currentRir={currentRir}
                    log={log}
                    onUpdateLog={(partial) => onUpdateExerciseLog(exercise.id, partial)}
                    onStartRestTimer={onStartRestTimer}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
