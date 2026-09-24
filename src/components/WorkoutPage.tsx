import React from 'react';
import { WorkoutSelector } from './WorkoutSelector';
import { ProgressBar } from './ProgressBar';
import { WorkoutTable } from './WorkoutTable';
import { WORKOUTS, WEEK_GUIDELINES } from '../data/workoutData';
import { ExerciseLog } from '../types/workout';
import { Info, Sparkles, CheckCheck } from 'lucide-react';

interface WorkoutPageProps {
  currentWeek: number;
  selectedWorkoutId: 'A' | 'B' | 'C';
  onSelectWorkoutId: (id: 'A' | 'B' | 'C') => void;
  logs: Record<string, ExerciseLog>;
  onUpdateExerciseLog: (exerciseId: string, partial: Partial<ExerciseLog>) => void;
  onResetCurrentWorkout: () => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
  completedCountsMap: Record<'A' | 'B' | 'C', number>;
}

export const WorkoutPage: React.FC<WorkoutPageProps> = ({
  currentWeek,
  selectedWorkoutId,
  onSelectWorkoutId,
  logs,
  onUpdateExerciseLog,
  onResetCurrentWorkout,
  onStartRestTimer,
  completedCountsMap,
}) => {
  const currentWorkout = WORKOUTS[selectedWorkoutId];
  const currentGuideline = WEEK_GUIDELINES.find((g) => g.week === currentWeek) || WEEK_GUIDELINES[0];

  const completedCount = completedCountsMap[selectedWorkoutId] || 0;
  const totalCount = currentWorkout.exercises.length;

  return (
    <div className="space-y-4 pb-12">
      {/* Workout Selector Tabs */}
      <WorkoutSelector
        selectedId={selectedWorkoutId}
        onSelect={onSelectWorkoutId}
        completedMap={completedCountsMap}
      />

      {/* Workout Header Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              {currentWorkout.dayName}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-semibold text-stone-500">
              Semana {currentWeek}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              RIR {currentGuideline.rir}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight mt-1">
            {currentWorkout.title} — {currentWorkout.subtitle}
          </h2>

          <p className="text-xs text-stone-500 mt-0.5">
            Foco: {currentWorkout.focusMuscles}
          </p>
        </div>

        {/* Quick batch check or guidance summary */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-left sm:text-right text-xs text-stone-500">
            <div>Descanso recomendado:</div>
            <div className="font-semibold text-stone-800">
              90–120s princ. · 60–90s isol.
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Component */}
      <ProgressBar
        completedCount={completedCount}
        totalCount={totalCount}
        onResetWorkout={completedCount > 0 ? onResetCurrentWorkout : undefined}
      />

      {/* Exercise Cards (Mobile) / Table (Desktop) */}
      <WorkoutTable
        workout={currentWorkout}
        currentRir={currentGuideline.rir}
        logs={logs}
        onUpdateExerciseLog={onUpdateExerciseLog}
        onStartRestTimer={onStartRestTimer}
      />
    </div>
  );
};
