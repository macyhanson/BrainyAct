export type DifficultyLevel = 1 | 2 | 3;

export type ExerciseCategory =
  | 'coordination'
  | 'balance'
  | 'bilateral'
  | 'strength'
  | 'calm';

export type ExerciseVariant = {
  id: string;
  exerciseId: string;
  level: DifficultyLevel;
  title: string;
  category: ExerciseCategory;
  durationSecTarget: number;
  cues: string[];
};

export type ExerciseResult = {
  missionId: string;
  childId: string;
  date: string; // YYYY-MM-DD
  exerciseId: string;
  category: ExerciseCategory;
  levelPlayed: DifficultyLevel;
  completed: boolean;
  skipped: boolean;
  tooHardTapped: boolean;
  doAgainTapped: boolean;
  attempts: number;
  durationSecActual: number;
};

export type CategoryPerformanceState = {
  childId: string;
  category: ExerciseCategory;
  currentLevel: DifficultyLevel;
  confidence: number;
  rollingSuccessRate: number;
  rollingAvgAttempts: number;
  rollingTooHardRate: number;
  rollingTimeRatio: number;
  streakStrong: number;
  streakStruggle: number;
  lastUpdatedAt: string;
};

export type ChildAdaptiveProfile = {
  childId: string;
  categories: Record<ExerciseCategory, CategoryPerformanceState>;
  globalSafetyMode?: boolean;
};
