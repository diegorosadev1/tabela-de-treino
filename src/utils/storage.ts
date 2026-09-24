import { WorkoutSessionLogs, WeeklyWeightRecord } from '../types/workout';

const STORAGE_KEYS = {
  CURRENT_WEEK: 'meu_treino_current_week',
  WORKOUT_LOGS_PREFIX: 'meu_treino_log_',
  WEIGHT_RECORDS: 'meu_treino_weights',
  ACTIVE_WORKOUT_TAB: 'meu_treino_active_tab',
};

export const getStoredCurrentWeek = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    if (val) {
      const num = parseInt(val, 10);
      if (num >= 1 && num <= 6) return num;
    }
  } catch {
    // fallback
  }
  return 1;
};

export const setStoredCurrentWeek = (week: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, String(week));
  } catch (err) {
    console.error('Failed to save current week', err);
  }
};

export const getStoredWorkoutLogs = (week: number, workoutId: 'A' | 'B' | 'C'): WorkoutSessionLogs => {
  try {
    const key = `${STORAGE_KEYS.WORKOUT_LOGS_PREFIX}w${week}_${workoutId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {};
};

export const saveStoredWorkoutLogs = (
  week: number,
  workoutId: 'A' | 'B' | 'C',
  logs: WorkoutSessionLogs
): void => {
  try {
    const key = `${STORAGE_KEYS.WORKOUT_LOGS_PREFIX}w${week}_${workoutId}`;
    localStorage.setItem(key, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save workout log', err);
  }
};

export const getAllStoredWorkoutLogs = (): Record<string, WorkoutSessionLogs> => {
  const result: Record<string, WorkoutSessionLogs> = {};
  try {
    for (let w = 1; w <= 6; w++) {
      for (const wId of ['A', 'B', 'C'] as const) {
        const key = `${STORAGE_KEYS.WORKOUT_LOGS_PREFIX}w${w}_${wId}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          result[`w${w}_${wId}`] = JSON.parse(raw);
        }
      }
    }
  } catch (err) {
    console.error('Failed to retrieve all workout logs', err);
  }
  return result;
};

export const getStoredWeightRecords = (): WeeklyWeightRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  // Initial defaults for 6 weeks, initial known weight 96kg for week 1
  return [
    { week: 1, weightKg: 96, date: 'Semana 1' },
    { week: 2, weightKg: null, date: 'Semana 2' },
    { week: 3, weightKg: null, date: 'Semana 3' },
    { week: 4, weightKg: null, date: 'Semana 4' },
    { week: 5, weightKg: null, date: 'Semana 5' },
    { week: 6, weightKg: null, date: 'Semana 6' },
  ];
};

export const saveStoredWeightRecords = (records: WeeklyWeightRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save weight records', err);
  }
};
