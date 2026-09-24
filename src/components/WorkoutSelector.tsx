import React from 'react';
import { WORKOUTS } from '../data/workoutData';

interface WorkoutSelectorProps {
  selectedId: 'A' | 'B' | 'C';
  onSelect: (id: 'A' | 'B' | 'C') => void;
  completedMap?: Record<'A' | 'B' | 'C', number>; // completed exercises per workout
}

export const WorkoutSelector: React.FC<WorkoutSelectorProps> = ({
  selectedId,
  onSelect,
  completedMap = { A: 0, B: 0, C: 0 },
}) => {
  const workoutIds: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];

  return (
    <div className="bg-stone-100 p-1.5 rounded-2xl flex gap-1.5 border border-stone-200">
      {workoutIds.map((id) => {
        const workout = WORKOUTS[id];
        const isSelected = selectedId === id;
        const count = completedMap[id] || 0;
        const isAllDone = count === 6;

        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex-1 py-2.5 px-2 rounded-xl text-center transition-all active:scale-[0.98] ${
              isSelected
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50 font-medium'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className={`text-xs ${isSelected ? 'text-rose-600 font-bold' : ''}`}>
                {workout.title}
              </span>
              {isAllDone ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Concluído" />
              ) : count > 0 ? (
                <span className="text-[10px] text-stone-400 font-mono">
                  {count}/6
                </span>
              ) : null}
            </div>
            <div className="text-[11px] text-stone-500 truncate mt-0.5">
              {id === 'A' ? 'Segunda' : id === 'B' ? 'Quarta' : 'Sexta'}
            </div>
          </button>
        );
      })}
    </div>
  );
};
