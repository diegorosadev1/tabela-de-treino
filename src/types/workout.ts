export interface Exercise {
  id: string;
  number: string;
  name: string;
  sets: number;
  reps: string;
  restTime: string; // e.g. "90–120s" or "60–90s"
  restSeconds: number; // e.g. 90 or 60 for timer
  type: 'principal' | 'isolado';
  muscleFocus: string;
}

export interface Workout {
  id: 'A' | 'B' | 'C';
  title: string;
  dayName: string;
  subtitle: string;
  focusMuscles: string;
  exercises: Exercise[];
}

export interface ExerciseLog {
  completed: boolean;
  loadKg: string;
  repsDone: string;
  updatedAt?: string;
}

export type WorkoutSessionLogs = Record<string, ExerciseLog>; // key: exercise.id

export interface WeeklyWeightRecord {
  week: number;
  weightKg: number | null;
  date?: string;
}

export interface WeekGuideline {
  week: number;
  label: string;
  rir: string;
  guidelines: string[];
}
