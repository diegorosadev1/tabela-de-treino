import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
  onResetWorkout?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completedCount,
  totalCount,
  onResetWorkout,
}) => {
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount && totalCount > 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Progresso do Treino
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-bold text-stone-900 tabular-nums">
              {completedCount}/{totalCount} exercícios concluídos
            </span>
            {isComplete && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Treino concluído! 💪
              </span>
            )}
          </div>
        </div>

        {completedCount > 0 && onResetWorkout && (
          <button
            onClick={onResetWorkout}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs"
            title="Reiniciar checks deste treino"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desmarcar</span>
          </button>
        )}
      </div>

      {/* Progress track */}
      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isComplete
              ? 'bg-emerald-500'
              : completedCount > 0
              ? 'bg-rose-500'
              : 'bg-stone-300'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
