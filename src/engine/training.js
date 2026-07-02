import { EXERCISES, SPLITS } from '../data/exercises.js';

const ROUNDING_STEP_KG = 2.5;

export function roundToStep(value, step = ROUNDING_STEP_KG) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value / step) * step;
}

export function estimateOneRepMax({ weight, reps, rir = 0 }) {
  const cleanWeight = Number(weight);
  const cleanReps = Number(reps);
  const cleanRir = Math.max(0, Number(rir) || 0);

  if (!Number.isFinite(cleanWeight) || cleanWeight <= 0) {
    throw new Error('La charge doit être supérieure à 0 kg.');
  }

  if (!Number.isFinite(cleanReps) || cleanReps < 1 || cleanReps > 30) {
    throw new Error('Les répétitions doivent être entre 1 et 30.');
  }

  const effectiveReps = Math.min(cleanReps + cleanRir, 20);
  const epley = cleanWeight * (1 + effectiveReps / 30);
  const brzycki = effectiveReps < 37 ? cleanWeight * 36 / (37 - effectiveReps) : epley;
  const estimate = (epley + brzycki) / 2;
  const trainingMax = estimate * 0.9;

  return {
    inputWeight: cleanWeight,
    inputReps: cleanReps,
    rir: cleanRir,
    effectiveReps,
    epley: roundToStep(epley),
    brzycki: roundToStep(brzycki),
    estimatedOneRm: roundToStep(estimate),
    trainingMax: roundToStep(trainingMax),
    reliability: getReliability(effectiveReps),
    warning: getEstimationWarning(effectiveReps)
  };
}

export function getReliability(reps) {
  if (reps >= 3 && reps <= 10) return 'haute';
  if (reps >= 11 && reps <= 15) return 'moyenne';
  return 'basse';
}

function getEstimationWarning(reps) {
  if (reps <= 2) return 'Estimation possible mais moins stable : très peu de répétitions.';
  if (reps > 15) return 'Estimation moins fiable au-delà de 15 répétitions : utilise plutôt une série de 5 à 10 répétitions propres.';
  return '';
}

export function getIntensityByGoal(goal, level) {
  const beginner = level === 'beginner';

  const map = {
    fat_loss: {
      label: 'Perte de gras avec maintien musculaire',
      percent: beginner ? 0.62 : 0.68,
      repRange: [8, 12],
      rest: '60-120 s',
      cardio: '2-3 × 20-30 min/semaine, zone facile à modérée'
    },
    hypertrophy: {
      label: 'Hypertrophie',
      percent: beginner ? 0.65 : 0.72,
      repRange: [6, 12],
      rest: '90-150 s',
      cardio: 'Optionnel : 1-2 séances faciles pour santé cardiovasculaire'
    },
    strength: {
      label: 'Force',
      percent: beginner ? 0.7 : 0.78,
      repRange: [3, 6],
      rest: '2-4 min',
      cardio: 'Faible volume cardio pour ne pas gêner la récupération'
    },
    recomposition: {
      label: 'Recomposition corporelle',
      percent: beginner ? 0.64 : 0.7,
      repRange: [6, 12],
      rest: '90-150 s',
      cardio: '2 × 20-30 min/semaine selon récupération'
    },
    general_health: {
      label: 'Santé générale',
      percent: beginner ? 0.55 : 0.62,
      repRange: [8, 15],
      rest: '60-120 s',
      cardio: 'Atteindre progressivement les repères OMS/CDC'
    }
  };

  return map[goal] || map.recomposition;
}

export function generateTrainingPlan({ profile, strengthTests }) {
  const level = profile.level || 'beginner';
  const days = Math.min(Math.max(Number(profile.daysPerWeek) || 3, 2), 5);
  const goal = profile.goal || 'recomposition';
  const intensity = getIntensityByGoal(goal, level);
  const split = SPLITS[days] || SPLITS[3];
  const testsByExercise = Object.fromEntries(strengthTests.map((test) => [test.exerciseId, test]));

  const sessions = split.map((sessionType, index) => buildSession({
    sessionType,
    index,
    intensity,
    level,
    testsByExercise,
    equipment: profile.equipment || 'basic'
  }));

  return {
    title: `${intensity.label} — ${days} séances/semaine`,
    level,
    daysPerWeek: days,
    goal,
    intensity,
    sessions,
    progression: buildProgressionRules(goal),
    safety: buildSafetyNotes(profile)
  };
}

function buildSession({ sessionType, index, intensity, level, testsByExercise, equipment }) {
  const templates = {
    full_body_a: ['squat', 'bench_press', 'row', 'lunge', 'plank'],
    full_body_b: ['deadlift', 'overhead_press', 'pulldown', 'squat', 'plank'],
    full_body_c: ['squat', 'bench_press', 'row', 'deadlift', 'lunge'],
    upper_a: ['bench_press', 'row', 'overhead_press', 'pulldown', 'plank'],
    lower_a: ['squat', 'deadlift', 'lunge', 'plank'],
    upper_b: ['overhead_press', 'pulldown', 'bench_press', 'row', 'plank'],
    lower_b: ['deadlift', 'squat', 'lunge', 'plank'],
    push_pull: ['bench_press', 'row', 'overhead_press', 'pulldown']
  };

  const exerciseIds = templates[sessionType] || templates.full_body_a;

  const exercises = exerciseIds.map((exerciseId, position) => {
    const exercise = EXERCISES.find((item) => item.id === exerciseId);
    const test = testsByExercise[exerciseId];
    const isMainLift = position <= 2 && exercise?.loadSource === 'estimated-1rm';
    const sets = isMainLift ? (level === 'beginner' ? 3 : 4) : 2;
    const repRange = isMainLift ? intensity.repRange : exercise.defaultRepRange;
    const load = test?.trainingMax
      ? roundToStep(test.trainingMax * intensity.percent)
      : null;

    return {
      id: exerciseId,
      name: exercise.name,
      muscles: exercise.muscles,
      sets,
      repRange,
      rest: intensity.rest,
      loadKg: load,
      loadText: load ? `${load} kg` : 'Choisir une charge à RIR 2-3',
      alternative: exercise.beginnerAlternative,
      note: load ? `Charge calculée depuis Training Max ${test.trainingMax} kg` : 'Pas encore de test sous-maximal pour cet exercice.'
    };
  });

  return {
    id: `session_${index + 1}`,
    title: `Séance ${index + 1}`,
    type: sessionType,
    exercises,
    warmup: buildWarmup(equipment),
    cooldown: '5-10 min facile + mobilité légère si utile.'
  };
}

function buildWarmup(equipment) {
  if (equipment === 'bodyweight') {
    return '5-8 min cardio léger + 2 séries progressives au poids du corps.';
  }
  return '5-8 min cardio léger + séries de chauffe progressives avant les mouvements principaux.';
}

function buildProgressionRules(goal) {
  return {
    method: 'Double progression',
    rule: 'Quand toutes les séries atteignent le haut de la fourchette avec technique propre, augmenter la charge à la prochaine séance.',
    upperBody: '+2 à +2,5 kg ou +2,5 à 5 %',
    lowerBody: '+2,5 à +5 kg ou +5 à 10 %',
    deload: 'Si fatigue élevée, douleur ou baisse de performance sur 2 séances : réduire le volume de 20-40 % pendant 1 semaine.',
    goalNote: goal === 'fat_loss'
      ? 'En déficit calorique, la priorité est de maintenir la force et la technique plutôt que de forcer la progression.'
      : 'La progression doit rester lente, mesurable et compatible avec la récupération.'
  };
}

function buildSafetyNotes(profile) {
  const flags = [];
  const text = `${profile.medicalFlags || ''} ${profile.injuries || ''}`.toLowerCase();
  const riskyTerms = [
    'douleur thoracique', 'malaise', 'syncope', 'cardiaque', 'hypertension', 'grossesse',
    'rein', 'rénal', 'diabète', 'blessure', 'rupture', 'douleur aiguë'
  ];

  riskyTerms.forEach((term) => {
    if (text.includes(term)) flags.push(term);
  });

  return {
    flags,
    message: flags.length
      ? 'Profil avec élément de prudence : demander un avis médical/professionnel avant de suivre un programme intensif.'
      : 'Aucun signal de prudence déclaré. Arrêter l’exercice en cas de douleur aiguë, malaise ou symptôme inhabituel.'
  };
}
