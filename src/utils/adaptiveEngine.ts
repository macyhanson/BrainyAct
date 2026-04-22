import {
  ChildAdaptiveProfile,
  CategoryPerformanceState,
  DifficultyLevel,
  ExerciseCategory,
  ExerciseResult,
  ExerciseVariant,
} from '../types/adaptive';

const CATEGORY_ORDER: ExerciseCategory[] = ['coordination', 'balance', 'bilateral', 'strength', 'calm'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function scoreResult(result: ExerciseResult, durationSecTarget: number): number {
  const timeRatio = result.durationSecActual / Math.max(1, durationSecTarget);
  let score = 0;

  if (result.completed) score += 40;
  if (result.skipped) score -= 40;
  if (result.tooHardTapped) score -= 25;

  score -= 8 * Math.max(0, result.attempts - 1);

  if (timeRatio <= 1.2) score += 10;
  else if (timeRatio > 1.6) score -= 10;

  if (result.doAgainTapped && result.completed) score += 5;

  return clamp(score, 0, 100);
}

export function classifyScore(score: number): 'strong' | 'neutral' | 'struggle' {
  if (score >= 75) return 'strong';
  if (score < 50) return 'struggle';
  return 'neutral';
}

export function createInitialAdaptiveProfile(childId: string): ChildAdaptiveProfile {
  const now = new Date().toISOString();
  const categories = CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = {
      childId,
      category,
      currentLevel: 2,
      confidence: 0.3,
      rollingSuccessRate: 0,
      rollingAvgAttempts: 0,
      rollingTooHardRate: 0,
      rollingTimeRatio: 0,
      streakStrong: 0,
      streakStruggle: 0,
      lastUpdatedAt: now,
    };
    return acc;
  }, {} as Record<ExerciseCategory, CategoryPerformanceState>);

  return { childId, categories, globalSafetyMode: false };
}

export function updateCategoryState(
  state: CategoryPerformanceState,
  recentResults: ExerciseResult[],
  variantLookup: Record<string, ExerciseVariant>,
  alreadyChangedToday: boolean,
  safetyCapLevel2: boolean
): CategoryPerformanceState {
  const windowed = recentResults.slice(-8);
  if (windowed.length === 0) return state;

  const scored = windowed.map((r) => {
    const variant = variantLookup[`${r.exerciseId}:${r.levelPlayed}`];
    const target = variant?.durationSecTarget ?? 60;
    const score = scoreResult(r, target);
    return { result: r, score, bucket: classifyScore(score), target };
  });

  const n = scored.length;
  const successRate = scored.filter((x) => x.result.completed && !x.result.skipped).length / n;
  const tooHardRate = scored.filter((x) => x.result.tooHardTapped).length / n;
  const avgAttempts = scored.reduce((acc, x) => acc + x.result.attempts, 0) / n;
  const avgTimeRatio = scored.reduce((acc, x) => acc + x.result.durationSecActual / Math.max(1, x.target), 0) / n;

  let streakStrong = 0;
  let streakStruggle = 0;

  for (let i = scored.length - 1; i >= 0; i--) {
    if (scored[i].bucket === 'strong' && streakStruggle === 0) streakStrong++;
    else break;
  }

  for (let i = scored.length - 1; i >= 0; i--) {
    if (scored[i].bucket === 'struggle' && streakStrong === 0) streakStruggle++;
    else break;
  }

  let confidence = clamp(state.confidence + 0.06, 0, 1);
  if (tooHardRate >= 0.25) confidence = clamp(confidence - 0.12, 0, 1);

  let nextLevel: DifficultyLevel = state.currentLevel;

  if (!alreadyChangedToday) {
    const shouldPromote =
      successRate >= 0.85 &&
      tooHardRate <= 0.1 &&
      avgAttempts <= 1.4 &&
      streakStrong >= 2 &&
      confidence >= 0.4;

    const shouldDemote = successRate < 0.6 || tooHardRate >= 0.25 || streakStruggle >= 2;

    if (shouldPromote) nextLevel = clamp((state.currentLevel + 1) as DifficultyLevel, 1, 3) as DifficultyLevel;
    else if (shouldDemote) nextLevel = clamp((state.currentLevel - 1) as DifficultyLevel, 1, 3) as DifficultyLevel;
  }

  if (safetyCapLevel2) nextLevel = Math.min(2, nextLevel) as DifficultyLevel;

  return {
    ...state,
    currentLevel: nextLevel,
    confidence,
    rollingSuccessRate: successRate,
    rollingAvgAttempts: avgAttempts,
    rollingTooHardRate: tooHardRate,
    rollingTimeRatio: avgTimeRatio,
    streakStrong,
    streakStruggle,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function updateAdaptiveProfile(
  profile: ChildAdaptiveProfile,
  results: ExerciseResult[],
  variants: ExerciseVariant[]
): ChildAdaptiveProfile {
  const variantLookup = variants.reduce((acc, v) => {
    acc[`${v.exerciseId}:${v.level}`] = v;
    return acc;
  }, {} as Record<string, ExerciseVariant>);

  const updatedCategories = { ...profile.categories };

  CATEGORY_ORDER.forEach((category) => {
    const categoryResults = results.filter((r) => r.category === category);
    updatedCategories[category] = updateCategoryState(
      profile.categories[category],
      categoryResults,
      variantLookup,
      false,
      profile.globalSafetyMode ?? false
    );
  });

  return { ...profile, categories: updatedCategories };
}

export function recommendVariant(
  variants: ExerciseVariant[],
  category: ExerciseCategory,
  level: DifficultyLevel,
  tooHardJustTapped = false
): ExerciseVariant | undefined {
  const targetLevel = (tooHardJustTapped ? Math.max(1, level - 1) : level) as DifficultyLevel;
  const categoryVariants = variants.filter((v) => v.category === category);

  return (
    categoryVariants.find((v) => v.level === targetLevel) ??
    categoryVariants.find((v) => v.level === 2) ??
    categoryVariants[0]
  );
}
