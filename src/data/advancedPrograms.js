export const DIEGO_ADVANCED_ABCD = {
  id: 'dynamic_advanced_split',
  label: 'Split avancé dynamique',
  sourceNote: 'Moteur dynamique : split, volume et exercices construits selon niveau, objectif, nombre de jours et familles calibrées. L’ancien ABCD reste la référence de style bodybuilding.',
  defaultCardioMinutes: 20,
  missingSessionNote: 'Avec 5 séances, le moteur ajoute une séance point faible/postérieur au lieu de répéter mécaniquement le même ABCD.'
};

const GOAL_PRESETS = {
  fat_loss: {
    label: 'perte de gras',
    cardioMinutes: 25,
    setShift: -1,
    reps: { heavy: [6, 10], main: [8, 12], isolation: [10, 15], pump: [12, 20], core: ['max'] },
    rest: { heavy: '90-150 s', main: '75-120 s', isolation: '45-75 s', pump: '30-60 s', core: '45-60 s' }
  },
  recomposition: {
    label: 'recomposition',
    cardioMinutes: 20,
    setShift: 0,
    reps: { heavy: [6, 10], main: [8, 12], isolation: [10, 15], pump: [12, 20], core: ['max'] },
    rest: { heavy: '90-150 s', main: '75-120 s', isolation: '45-90 s', pump: '45-75 s', core: '45-60 s' }
  },
  hypertrophy: {
    label: 'hypertrophie',
    cardioMinutes: 15,
    setShift: 1,
    reps: { heavy: [6, 10], main: [8, 12], isolation: [10, 15], pump: [12, 20], core: ['max'] },
    rest: { heavy: '90-180 s', main: '75-150 s', isolation: '45-90 s', pump: '45-75 s', core: '45-60 s' }
  },
  lean_bulk: {
    label: 'prise de masse sèche',
    cardioMinutes: 15,
    setShift: 1,
    reps: { heavy: [6, 10], main: [8, 12], isolation: [10, 15], pump: [12, 20], core: ['max'] },
    rest: { heavy: '90-180 s', main: '75-150 s', isolation: '45-90 s', pump: '45-75 s', core: '45-60 s' }
  },
  strength: {
    label: 'force',
    cardioMinutes: 10,
    setShift: 0,
    reps: { heavy: [3, 6], main: [5, 8], isolation: [8, 12], pump: [10, 15], core: ['max'] },
    rest: { heavy: '2-4 min', main: '90-180 s', isolation: '60-90 s', pump: '45-75 s', core: '45-60 s' }
  },
  general_health: {
    label: 'santé générale',
    cardioMinutes: 20,
    setShift: -1,
    reps: { heavy: [8, 12], main: [10, 15], isolation: [12, 15], pump: [12, 20], core: ['max'] },
    rest: { heavy: '75-120 s', main: '60-120 s', isolation: '45-75 s', pump: '45-75 s', core: '45-60 s' }
  }
};

const EXERCISE_TEMPLATES = {
  incline_press: item('Développé incliné barre', 'horizontal_push', 'incline_barbell_press', ['haut pectoraux', 'pectoraux'], 'heavy', 3, 2),
  bench_press: item('Développé couché', 'horizontal_push', 'bench_press', ['pectoraux'], 'heavy', 3, 1),
  decline_press: item('Développé décliné', 'horizontal_push', 'decline_press', ['pectoraux'], 'main', 2, 1),
  incline_dumbbell: item('Développé incliné haltères', 'horizontal_push', 'incline_dumbbell_press', ['haut pectoraux', 'pectoraux'], 'main', 3, 1),
  chest_press: item('Chest press machine', 'horizontal_push', 'chest_press_machine', ['pectoraux'], 'main', 3, 1),
  pec_deck: item('Pec deck', 'pec_isolation', 'pec_deck', ['pectoraux'], 'isolation', 3, 1),
  cable_fly: item('Écarté poulie', 'pec_isolation', 'cable_fly', ['pectoraux'], 'pump', 2, 0),

  row_barbell: item('Rowing barre', 'horizontal_pull', 'bent_over_row', ['dos', 'rhomboïdes'], 'heavy', 3, 2),
  row_machine: item('Rowing machine', 'horizontal_pull', 'row_machine', ['dos'], 'main', 3, 1),
  low_row_triangle: item('Rameur bas prise triangle', 'horizontal_pull', 'low_row_triangle', ['dos', 'biceps'], 'main', 3, 1),
  high_row: item('High row machine', 'horizontal_pull', 'high_row_machine', ['dos', 'trapèzes'], 'main', 3, 1),
  face_pull: item('Face pull corde', 'horizontal_pull', 'face_pull', ['deltoïde postérieur', 'trapèzes'], 'isolation', 2, 0),
  pulldown: item('Tirage vertical / pulley avant', 'vertical_pull', 'pulldown', ['grand dorsal', 'biceps'], 'main', 3, 1),
  pulldown_supinated: item('Tirage supination', 'vertical_pull', 'pulldown_supinated', ['grand dorsal', 'biceps'], 'main', 3, 1),
  pullover: item('Pullover poulie bras tendus', 'vertical_pull', 'pullover_cable', ['grand dorsal'], 'pump', 2, 0),

  shoulder_press: item('Développé assis', 'vertical_push', 'seated_press', ['épaules'], 'heavy', 3, 2),
  shoulder_machine: item('Shoulder press machine', 'vertical_push', 'shoulder_press_machine', ['épaules'], 'main', 3, 1),
  lateral_raise: item('Élévation latérale haltères', 'shoulder_abduction', 'lateral_raise', ['deltoïde latéral'], 'isolation', 3, 1),
  cable_lateral_raise: item('Élévation latérale poulie', 'shoulder_abduction', 'cable_lateral_raise', ['deltoïde latéral'], 'pump', 2, 0),
  front_raise: item('Élévation frontale à la corde', 'vertical_push', 'front_raise_cable', ['deltoïde antérieur'], 'pump', 2, 0),

  smith_squat: item('Squat Smith', 'leg_press_pattern', 'smith_squat', ['quadriceps', 'fessiers'], 'heavy', 3, 2),
  hack_squat: item('Hack squat', 'leg_press_pattern', 'hack_squat', ['quadriceps', 'fessiers'], 'heavy', 3, 2),
  leg_press: item('Leg press 45°', 'leg_press_pattern', 'leg_press_45', ['quadriceps', 'fessiers'], 'main', 3, 1),
  leg_extension: item('Leg extension', 'knee_extension', 'leg_extension', ['quadriceps'], 'isolation', 3, 1),
  lying_leg_curl: item('Leg curl couché', 'knee_flexion', 'lying_leg_curl', ['ischios'], 'isolation', 3, 1),
  seated_leg_curl: item('Leg curl assis', 'knee_flexion', 'seated_leg_curl', ['ischios'], 'isolation', 3, 1),
  hip_thrust: item('Hip thrust', 'hip_extension', 'hip_thrust', ['fessiers'], 'main', 3, 1),
  rdl: item('Soulevé de terre roumain', 'hip_extension', 'rdl', ['ischios', 'fessiers', 'lombaires'], 'main', 3, 1),

  barbell_curl: item('Curl barre debout', 'elbow_flexion', 'barbell_curl', ['biceps'], 'isolation', 3, 1),
  machine_curl: item('Curl Scott machine', 'elbow_flexion', 'machine_curl', ['biceps'], 'isolation', 2, 1),
  cable_curl: item('Curl câble', 'elbow_flexion', 'cable_curl', ['biceps'], 'pump', 2, 0),
  rope_pushdown: item('Extension triceps à la corde', 'elbow_extension', 'rope_pushdown', ['triceps'], 'isolation', 3, 1),
  french_press: item('Triceps français avec haltère', 'elbow_extension', 'french_press', ['triceps'], 'isolation', 2, 1),
  bar_pushdown: item('Pushdown barre', 'elbow_extension', 'bar_pushdown', ['triceps'], 'pump', 2, 0),

  standing_calf: item('Mollets debout à la machine', 'calf_raise', 'standing_calf_machine', ['mollets'], 'isolation', 4, 1),
  seated_calf: item('Mollets assis', 'calf_raise', 'seated_calf_machine', ['mollets'], 'isolation', 3, 1),

  upper_abs: item('Abdominaux supérieurs', 'core', null, ['abdominaux'], 'core', 3, 0, '45 s'),
  lower_abs: item('Abdominaux inférieurs', 'core', null, ['abdominaux'], 'core', 3, 0, '45 s'),
  plank: item('Gainage', 'core', null, ['abdominaux'], 'core', 3, 0, '45 s')
};

const FOUR_DAY_SPLIT = [
  {
    id: 'push',
    title: 'Entraînement A',
    subtitle: 'Push — pectoraux, épaules, triceps',
    exercises: ['incline_press', 'bench_press', 'pec_deck', 'shoulder_press', 'lateral_raise', 'rope_pushdown', 'upper_abs']
  },
  {
    id: 'pull',
    title: 'Entraînement B',
    subtitle: 'Pull — dos, deltoïde postérieur, biceps',
    exercises: ['row_barbell', 'pulldown', 'low_row_triangle', 'face_pull', 'barbell_curl', 'cable_curl']
  },
  {
    id: 'legs',
    title: 'Entraînement C',
    subtitle: 'Jambes — quadriceps, ischios, fessiers, mollets',
    exercises: ['hack_squat', 'leg_press', 'leg_extension', 'lying_leg_curl', 'hip_thrust', 'standing_calf', 'lower_abs']
  },
  {
    id: 'upper_specialization',
    title: 'Entraînement D',
    subtitle: 'Haut du corps — rappel pecs/dos/épaules/bras',
    exercises: ['incline_dumbbell', 'cable_fly', 'high_row', 'pulldown_supinated', 'cable_lateral_raise', 'machine_curl', 'french_press', 'plank']
  }
];

const FIVE_DAY_SPLIT = [
  {
    id: 'pecs_triceps',
    title: 'Entraînement A',
    subtitle: 'Pecs + triceps',
    exercises: ['incline_press', 'bench_press', 'decline_press', 'pec_deck', 'cable_fly', 'rope_pushdown', 'french_press', 'upper_abs']
  },
  {
    id: 'back_biceps',
    title: 'Entraînement B',
    subtitle: 'Dos + biceps',
    exercises: ['row_barbell', 'low_row_triangle', 'pulldown', 'high_row', 'face_pull', 'barbell_curl', 'cable_curl']
  },
  {
    id: 'legs_quad_glute',
    title: 'Entraînement C',
    subtitle: 'Jambes — quadriceps/fessiers',
    exercises: ['hack_squat', 'leg_press', 'leg_extension', 'hip_thrust', 'standing_calf', 'lower_abs']
  },
  {
    id: 'delts_arms',
    title: 'Entraînement D',
    subtitle: 'Épaules + bras',
    exercises: ['shoulder_press', 'shoulder_machine', 'lateral_raise', 'cable_lateral_raise', 'bar_pushdown', 'machine_curl', 'plank']
  },
  {
    id: 'posterior_chain',
    title: 'Entraînement E',
    subtitle: 'Chaîne postérieure + rappels faibles',
    exercises: ['rdl', 'seated_leg_curl', 'hip_thrust', 'pullover', 'seated_calf', 'chest_press', 'lower_abs']
  }
];

function item(name, familyId, transferKey, muscles, role, baseSets, prepSets, rest = '') {
  return { name, familyId, transferKey, muscles, role, baseSets, prepSets, rest };
}

export function buildAdvancedSessions({ daysPerWeek, goal = 'hypertrophy' }) {
  const days = Math.min(Math.max(Number(daysPerWeek) || 4, 4), 5);
  const preset = getGoalPreset(goal);
  const split = days >= 5 ? FIVE_DAY_SPLIT : FOUR_DAY_SPLIT;

  return split.slice(0, days).map((session, index) => ({
    id: `advanced_${session.id}`,
    title: session.title,
    subtitle: `${session.subtitle} · ${preset.label}`,
    sourceLabel: 'split avancé généré dynamiquement',
    cardioMinutes: preset.cardioMinutes,
    exercises: session.exercises.map((key) => buildExercise(EXERCISE_TEMPLATES[key], preset, index))
  }));
}

function buildExercise(template, preset, sessionIndex) {
  const role = template.role || 'main';
  const baseShift = role === 'core' ? 0 : preset.setShift;
  const validSets = Math.max(role === 'pump' ? 2 : 3, template.baseSets + baseShift);
  const reps = preset.reps[role] || preset.reps.main;
  const rest = template.rest || preset.rest[role] || preset.rest.main;

  return {
    name: template.name,
    familyId: template.familyId,
    transferKey: template.transferKey,
    muscles: template.muscles,
    role,
    prepSets: template.prepSets,
    validSets,
    reps,
    rest,
    warmup: buildWarmupText(template, sessionIndex)
  };
}

function buildWarmupText(template, sessionIndex) {
  if (template.role === 'heavy' && sessionIndex <= 2) return '2 séries progressives avant les séries valides';
  if (template.prepSets > 0) return `${template.prepSets} série(s) de montée en charge`;
  return 'Contrôle technique, amplitude propre';
}

function getGoalPreset(goal) {
  return GOAL_PRESETS[goal] || GOAL_PRESETS.hypertrophy;
}

export function calculateAdvancedMetrics(sessions) {
  const byMuscle = {};
  const byFamily = {};
  let totalValidSets = 0;
  let totalPrepSets = 0;
  let cardioMinutes = 0;

  for (const session of sessions) {
    cardioMinutes += session.cardioMinutes || 0;

    for (const exercise of session.exercises) {
      totalValidSets += exercise.validSets || 0;
      totalPrepSets += exercise.prepSets || 0;
      byFamily[exercise.familyId] = (byFamily[exercise.familyId] || 0) + (exercise.validSets || 0);

      for (const muscle of exercise.muscles || []) {
        byMuscle[muscle] = (byMuscle[muscle] || 0) + (exercise.validSets || 0);
      }
    }
  }

  return {
    totalValidSets,
    totalPrepSets,
    cardioMinutes,
    byMuscle,
    byFamily,
    densityNote: totalValidSets >= 95
      ? 'Volume très élevé : réserver aux profils très entraînés avec sommeil, nutrition et récupération solides.'
      : totalValidSets >= 75
        ? 'Volume avancé : surveiller fatigue, douleurs articulaires et baisse de performance.'
        : 'Volume avancé modéré : utile si récupération ou déficit calorique limitent la tolérance au volume.'
  };
}
