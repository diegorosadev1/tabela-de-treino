import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { WorkoutPage } from './components/WorkoutPage';
import { ProgressPage } from './components/ProgressPage';
import { RestTimer } from './components/RestTimer';
import { WeekSelectorModal } from './components/WeekSelectorModal';
import {
  getStoredCurrentWeek,
  setStoredCurrentWeek,
  getAllStoredWorkoutLogs,
  saveStoredWorkoutLogs,
  getStoredWeightRecords,
  saveStoredWeightRecords,
} from './utils/storage';
import { ExerciseLog, WeeklyWeightRecord, WorkoutSessionLogs } from './types/workout';
import { Dumbbell, Home, BarChart3, Calendar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<'A' | 'B' | 'C'>('A');

  // Workout logs by key `w${week}_${workoutId}`
  const [allLogs, setAllLogs] = useState<Record<string, WorkoutSessionLogs>>({});
  // Weight records
  const [weightRecords, setWeightRecords] = useState<WeeklyWeightRecord[]>([]);

  // Modals & Timers
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
  const [timerState, setTimerState] = useState<{
    isOpen: boolean;
    seconds: number;
    exerciseName: string;
  }>({
    isOpen: false,
    seconds: 90,
    exerciseName: '',
  });

  // Initialize from storage & set default workout based on day of week
  useEffect(() => {
    const savedWeek = getStoredCurrentWeek();
    setCurrentWeek(savedWeek);

    const savedLogs = getAllStoredWorkoutLogs();
    setAllLogs(savedLogs);

    const savedWeights = getStoredWeightRecords();
    setWeightRecords(savedWeights);

    // Auto-detect day of week to pre-select workout
    const day = new Date().getDay();
    if (day === 1) setSelectedWorkoutId('A'); // Monday
    else if (day === 3) setSelectedWorkoutId('B'); // Wednesday
    else if (day === 5) setSelectedWorkoutId('C'); // Friday
  }, []);

  // Update current week
  const handleSelectWeek = (week: number) => {
    setCurrentWeek(week);
    setStoredCurrentWeek(week);
  };

  // Get active session logs
  const currentSessionKey = `w${currentWeek}_${selectedWorkoutId}`;
  const currentWorkoutLogs = allLogs[currentSessionKey] || {};

  // Update exercise log
  const handleUpdateExerciseLog = (exerciseId: string, partial: Partial<ExerciseLog>) => {
    const updatedSession = {
      ...currentWorkoutLogs,
      [exerciseId]: {
        ...(currentWorkoutLogs[exerciseId] || { completed: false, loadKg: '', repsDone: '' }),
        ...partial,
        updatedAt: new Date().toISOString(),
      },
    };

    const nextAllLogs = {
      ...allLogs,
      [currentSessionKey]: updatedSession,
    };

    setAllLogs(nextAllLogs);
    saveStoredWorkoutLogs(currentWeek, selectedWorkoutId, updatedSession);
  };

  // Reset current workout checks
  const handleResetCurrentWorkout = () => {
    const clearedSession: WorkoutSessionLogs = {};
    Object.entries(currentWorkoutLogs).forEach(([id, log]) => {
      clearedSession[id] = {
        ...log,
        completed: false,
      };
    });

    const nextAllLogs = {
      ...allLogs,
      [currentSessionKey]: clearedSession,
    };

    setAllLogs(nextAllLogs);
    saveStoredWorkoutLogs(currentWeek, selectedWorkoutId, clearedSession);
  };

  // Update weight records
  const handleSaveWeight = (week: number, weight: number | null) => {
    const updated = weightRecords.map((r) =>
      r.week === week ? { ...r, weightKg: weight, date: new Date().toLocaleDateString('pt-BR') } : r
    );
    setWeightRecords(updated);
    saveStoredWeightRecords(updated);
  };

  // Start rest timer
  const handleStartRestTimer = (seconds: number, exerciseName: string) => {
    setTimerState({
      isOpen: true,
      seconds,
      exerciseName,
    });
  };

  // Switch to workout tab with selected ID
  const handleSelectWorkoutFromSchedule = (id: 'A' | 'B' | 'C') => {
    setSelectedWorkoutId(id);
    setActiveTab('workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Completed counts for active week's workouts
  const completedCountsMap = useMemo(() => {
    const map: Record<'A' | 'B' | 'C', number> = { A: 0, B: 0, C: 0 };
    (['A', 'B', 'C'] as const).forEach((wId) => {
      const logs = allLogs[`w${currentWeek}_${wId}`] || {};
      map[wId] = Object.values(logs).filter((l) => l.completed).length;
    });
    return map;
  }, [allLogs, currentWeek]);

  // Is completed boolean for weekly schedule checkmarks
  const completedWorkoutsThisWeek = useMemo(() => {
    return {
      A: completedCountsMap.A >= 6,
      B: completedCountsMap.B >= 6,
      C: completedCountsMap.C >= 6,
    };
  }, [completedCountsMap]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentWeek={currentWeek}
        onOpenWeekSelector={() => setIsWeekModalOpen(true)}
        onToggleTimer={() =>
          setTimerState((prev) => ({
            ...prev,
            isOpen: !prev.isOpen,
            seconds: prev.seconds || 90,
          }))
        }
        activeTimerOpen={timerState.isOpen}
      />

      {/* Desktop Navigation Bar (hidden on mobile, uses bottom nav on mobile) */}
      <div className="hidden md:block bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                activeTab === 'home'
                  ? 'border-rose-600 text-rose-600 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </button>
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                activeTab === 'workout'
                  ? 'border-rose-600 text-rose-600 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Ficha de Treino</span>
              {completedCountsMap[selectedWorkoutId] > 0 && (
                <span className="text-xs bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded-full font-mono">
                  {completedCountsMap[selectedWorkoutId]}/6
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
                activeTab === 'progress'
                  ? 'border-rose-600 text-rose-600 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Progresso</span>
            </button>
          </nav>

          <button
            onClick={() => setIsWeekModalOpen(true)}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Semana {currentWeek} de 6</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-8">
        {activeTab === 'home' && (
          <HomePage
            currentWeek={currentWeek}
            onOpenWeekSelector={() => setIsWeekModalOpen(true)}
            onSelectWorkout={handleSelectWorkoutFromSchedule}
            completedWorkoutsThisWeek={completedWorkoutsThisWeek}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutPage
            currentWeek={currentWeek}
            selectedWorkoutId={selectedWorkoutId}
            onSelectWorkoutId={setSelectedWorkoutId}
            logs={currentWorkoutLogs}
            onUpdateExerciseLog={handleUpdateExerciseLog}
            onResetCurrentWorkout={handleResetCurrentWorkout}
            onStartRestTimer={handleStartRestTimer}
            completedCountsMap={completedCountsMap}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressPage
            currentWeek={currentWeek}
            weightRecords={weightRecords}
            onSaveWeight={handleSaveWeight}
            allLogs={allLogs}
          />
        )}
      </main>

      {/* Floating Rest Timer */}
      <RestTimer
        isOpen={timerState.isOpen}
        initialSeconds={timerState.seconds}
        exerciseName={timerState.exerciseName}
        onClose={() => setTimerState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Week Selector Modal */}
      <WeekSelectorModal
        isOpen={isWeekModalOpen}
        onClose={() => setIsWeekModalOpen(false)}
        currentWeek={currentWeek}
        onSelectWeek={handleSelectWeek}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        completedExercisesCount={completedCountsMap[selectedWorkoutId]}
      />
    </div>
  );
}
