import React, { useState } from 'react';
import { WeeklyWeightRecord, WorkoutSessionLogs } from '../types/workout';
import { WORKOUT_A, WORKOUT_B, WORKOUT_C } from '../data/workoutData';
import { CheckCircle2, Dumbbell, Calendar, Scale, Activity } from 'lucide-react';

interface ProgressPageProps {
  currentWeek: number;
  weightRecords: WeeklyWeightRecord[];
  onSaveWeight: (week: number, weight: number | null) => void;
  allLogs: Record<string, WorkoutSessionLogs>;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  currentWeek,
  weightRecords,
  onSaveWeight,
  allLogs,
}) => {
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState<string>('');

  // 18 workouts planned across 6 weeks (3 per week)
  const totalPlannedWorkouts = 18;

  // Calculate completed workouts & completed exercises
  let completedWorkoutsCount = 0;
  let totalExercisesCompleted = 0;

  // Unique exercises for load progression lookup
  const exerciseLoadMap: Record<string, { name: string; latestLoad: string; history: string[] }> = {};

  // Seed exercise names
  const allExercises = [
    ...WORKOUT_A.exercises,
    ...WORKOUT_B.exercises,
    ...WORKOUT_C.exercises,
  ];

  allExercises.forEach((ex) => {
    if (!exerciseLoadMap[ex.name]) {
      exerciseLoadMap[ex.name] = {
        name: ex.name,
        latestLoad: '',
        history: [],
      };
    }
  });

  // Process logs
  for (let w = 1; w <= 6; w++) {
    for (const wId of ['A', 'B', 'C'] as const) {
      const sessionKey = `w${w}_${wId}`;
      const sessionLogs = allLogs[sessionKey] || {};
      const completedInSession = Object.values(sessionLogs).filter((l) => l.completed).length;

      if (completedInSession >= 6) {
        completedWorkoutsCount += 1;
      }

      totalExercisesCompleted += completedInSession;

      // Check recorded loads
      Object.entries(sessionLogs).forEach(([exId, log]) => {
        if (log.loadKg && parseFloat(log.loadKg) > 0) {
          // Find exercise name
          const target = allExercises.find((e) => e.id === exId);
          if (target && exerciseLoadMap[target.name]) {
            exerciseLoadMap[target.name].latestLoad = `${log.loadKg} kg`;
            exerciseLoadMap[target.name].history.push(`Semana ${w}: ${log.loadKg} kg`);
          }
        }
      });
    }
  }

  // Workout consistency frequency %
  const frequencyPercent = Math.min(100, Math.round((completedWorkoutsCount / totalPlannedWorkouts) * 100));

  const handleStartEditWeight = (week: number, currentVal: number | null) => {
    setEditingWeek(week);
    setWeightInput(currentVal !== null ? String(currentVal) : '');
  };

  const handleSaveWeight = (week: number) => {
    const val = parseFloat(weightInput.replace(',', '.'));
    if (!isNaN(val) && val > 30 && val < 300) {
      onSaveWeight(week, val);
    } else if (weightInput.trim() === '') {
      onSaveWeight(week, null);
    }
    setEditingWeek(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 px-1">
          Resumo Geral (6 Semanas)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Treinos Concluídos */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-stone-500 font-medium">Treinos Feitos</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
                {completedWorkoutsCount}
              </span>
              <span className="text-xs text-stone-400 font-mono">/ 18</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-1">
              6 semanas de plano
            </span>
          </div>

          {/* Card 2: Planejados */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-stone-500 font-medium">Planejados</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
                {totalPlannedWorkouts}
              </span>
              <span className="text-xs text-stone-400 font-mono">sessões</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-1">
              3 musculações / sem
            </span>
          </div>

          {/* Card 3: Frequência */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-stone-500 font-medium">Consistência</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 tabular-nums">
                {frequencyPercent}%
              </span>
            </div>
            <span className="text-[11px] text-stone-400 mt-1">
              frequência do ciclo
            </span>
          </div>

          {/* Card 4: Exercícios Feitos */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-stone-500 font-medium">Exercícios</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 tabular-nums">
                {totalExercisesCompleted}
              </span>
              <span className="text-xs text-stone-400 font-mono">séries</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-1">
              execuções com check
            </span>
          </div>
        </div>
      </div>

      {/* Peso Corporal Semanal */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900">
                Registro de Peso Corporal
              </h3>
              <p className="text-xs text-stone-500">
                1 registro por semana para acompanhamento
              </p>
            </div>
          </div>
        </div>

        {/* 6 Weeks Weight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {weightRecords.map((record) => {
            const isCurrent = record.week === currentWeek;
            const isEditing = editingWeek === record.week;

            return (
              <div
                key={record.week}
                className={`p-3 rounded-xl border transition-all text-center flex flex-col justify-between min-h-[96px] ${
                  isCurrent
                    ? 'bg-rose-50/50 border-rose-300'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-semibold text-stone-700">
                    Semana {record.week}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                </div>

                <div className="my-1.5">
                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="number"
                        step="0.1"
                        autoFocus
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        placeholder="kg"
                        className="w-full text-center h-8 text-xs font-bold rounded-lg border border-rose-400 bg-white focus:outline-none"
                      />
                      <div className="flex gap-1 justify-center">
                        <button
                          type="button"
                          onClick={() => handleSaveWeight(record.week)}
                          className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingWeek(null)}
                          className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-[10px]"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {record.weightKg !== null ? (
                        <div className="text-base font-bold font-mono text-stone-900 tabular-nums">
                          {record.weightKg.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg</span>
                        </div>
                      ) : (
                        <div className="text-xs text-stone-400 italic">
                          Não registrado
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => handleStartEditWeight(record.week, record.weightKg)}
                    className="text-[11px] font-medium text-rose-600 hover:text-rose-700 active:scale-95"
                  >
                    {record.weightKg !== null ? 'Alterar' : '+ Registrar'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-stone-400 italic text-center sm:text-left">
          * Apenas dados registrados objetivamente, sem comparações ou julgamentos.
        </p>
      </div>

      {/* Cargas Registradas por Exercício */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900">
              Cargas Registradas
            </h3>
            <p className="text-xs text-stone-500">
              Histórico das últimas cargas anotadas nos exercícios
            </p>
          </div>
        </div>

        <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden mt-3">
          {Object.values(exerciseLoadMap).map((item) => (
            <div
              key={item.name}
              className="p-3 sm:px-4 flex items-center justify-between hover:bg-stone-50/80 transition-colors"
            >
              <div>
                <span className="font-semibold text-xs sm:text-sm text-stone-800 uppercase block">
                  {item.name}
                </span>
                {item.history.length > 0 ? (
                  <span className="text-[11px] text-stone-400">
                    {item.history.slice(-2).join(' · ')}
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400 italic">
                    Sem carga anotada ainda
                  </span>
                )}
              </div>

              <div className="text-right">
                {item.latestLoad ? (
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-900 font-mono font-bold text-xs sm:text-sm">
                    {item.latestLoad}
                  </span>
                ) : (
                  <span className="text-xs text-stone-400">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
