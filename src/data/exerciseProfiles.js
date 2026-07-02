const DEFAULT_CONFIDENCE_FLOOR = 15;

export const EXERCISE_PROFILES = {
  bench_press: {
    id: 'bench_press',
    names: ['Développé couché'],
    familyId: 'horizontal_push',
    zoneId: 'pecs',
    movementGroup: 'horizontal_push',
    mechanics: 'compound_press',
    modality: 'barbell',
    stability: 0.65,
    loadScale: 1,
    muscles: { pectoraux: 0.55, triceps: 0.25, deltoide_anterieur: 0.2 }
  },
  chest_press_machine: {
    id: 'chest_press_machine',
    names: ['Chest press machine'],
    familyId: 'horizontal_push',
    zoneId: 'pecs',
    movementGroup: 'horizontal_push',
    mechanics: 'compound_press',
    modality: 'machine',
    stability: 0.9,
    loadScale: 1.05,
    muscles: { pectoraux: 0.58, triceps: 0.24, deltoide_anterieur: 0.18 }
  },
  incline_press: {
    id: 'incline_press',
    names: ['Développé incliné'],
    familyId: 'horizontal_push',
    zoneId: 'pecs',
    movementGroup: 'incline_push',
    mechanics: 'compound_press',
    modality: 'barbell_or_machine',
    stability: 0.7,
    loadScale: 0.9,
    muscles: { pectoraux: 0.48, deltoide_anterieur: 0.3, triceps: 0.22 }
  },
  decline_press: {
    id: 'decline_press',
    names: ['Développé décliné'],
    familyId: 'horizontal_push',
    zoneId: 'pecs',
    movementGroup: 'horizontal_push',
    mechanics: 'compound_press',
    modality: 'barbell_or_machine',
    stability: 0.72,
    loadScale: 1.03,
    muscles: { pectoraux: 0.62, triceps: 0.24, deltoide_anterieur: 0.14 }
  },
  dumbbell_press: {
    id: 'dumbbell_press',
    names: ['Développé haltères'],
    familyId: 'horizontal_push',
    zoneId: 'pecs',
    movementGroup: 'horizontal_push',
    mechanics: 'compound_press',
    modality: 'dumbbell',
    stability: 0.55,
    loadScale: 0.75,
    muscles: { pectoraux: 0.55, triceps: 0.22, deltoide_anterieur: 0.23 }
  },

  row_machine: {
    id: 'row_machine',
    names: ['Rowing machine ou rameur bas'],
    familyId: 'horizontal_pull',
    zoneId: 'dos',
    movementGroup: 'horizontal_pull',
    mechanics: 'compound_pull',
    modality: 'machine',
    stability: 0.86,
    loadScale: 1,
    muscles: { grand_dorsal: 0.36, rhomboides: 0.24, trapezes: 0.18, biceps: 0.22 }
  },
  bent_over_row: {
    id: 'bent_over_row',
    names: ['Rowing barre', 'Rameur courbé proné'],
    familyId: 'horizontal_pull',
    zoneId: 'dos',
    movementGroup: 'horizontal_pull',
    mechanics: 'compound_pull',
    modality: 'barbell',
    stability: 0.58,
    loadScale: 0.9,
    muscles: { grand_dorsal: 0.34, rhomboides: 0.23, trapezes: 0.18, biceps: 0.18, lombaires: 0.07 }
  },
  low_row_triangle: {
    id: 'low_row_triangle',
    names: ['Rameur bas prise triangle'],
    familyId: 'horizontal_pull',
    zoneId: 'dos',
    movementGroup: 'horizontal_pull',
    mechanics: 'compound_pull',
    modality: 'cable',
    stability: 0.84,
    loadScale: 1,
    muscles: { grand_dorsal: 0.38, rhomboides: 0.22, trapezes: 0.15, biceps: 0.25 }
  },
  low_row_wide: {
    id: 'low_row_wide',
    names: ['Rameur bas prise ouverte machine'],
    familyId: 'horizontal_pull',
    zoneId: 'dos',
    movementGroup: 'horizontal_pull',
    mechanics: 'compound_pull',
    modality: 'machine',
    stability: 0.86,
    loadScale: 0.95,
    muscles: { rhomboides: 0.28, trapezes: 0.24, grand_dorsal: 0.28, biceps: 0.2 }
  },
  dumbbell_row_supported: {
    id: 'dumbbell_row_supported',
    names: ['Rowing haltère appuyé'],
    familyId: 'horizontal_pull',
    zoneId: 'dos',
    movementGroup: 'horizontal_pull',
    mechanics: 'compound_pull',
    modality: 'dumbbell_supported',
    stability: 0.72,
    loadScale: 0.75,
    muscles: { grand_dorsal: 0.38, rhomboides: 0.22, trapezes: 0.15, biceps: 0.25 }
  },

  pulldown: {
    id: 'pulldown',
    names: ['Tirage vertical / pulley avant', 'Lat pulldown machine'],
    familyId: 'vertical_pull',
    zoneId: 'dos',
    movementGroup: 'vertical_pull',
    mechanics: 'compound_pull',
    modality: 'cable_or_machine',
    stability: 0.84,
    loadScale: 1,
    muscles: { grand_dorsal: 0.48, biceps: 0.25, rhomboides: 0.15, trapezes: 0.12 }
  },
  pulldown_supinated: {
    id: 'pulldown_supinated',
    names: ['Tirage supination', 'Pulley avant supination'],
    familyId: 'vertical_pull',
    zoneId: 'dos',
    movementGroup: 'vertical_pull',
    mechanics: 'compound_pull',
    modality: 'cable',
    stability: 0.84,
    loadScale: 0.95,
    muscles: { grand_dorsal: 0.42, biceps: 0.32, rhomboides: 0.14, trapezes: 0.12 }
  },
  assisted_pullup: {
    id: 'assisted_pullup',
    names: ['Tractions assistées'],
    familyId: 'vertical_pull',
    zoneId: 'dos',
    movementGroup: 'vertical_pull',
    mechanics: 'compound_pull',
    modality: 'bodyweight_assisted',
    stability: 0.66,
    loadScale: 0.9,
    muscles: { grand_dorsal: 0.48, biceps: 0.25, rhomboides: 0.15, trapezes: 0.12 }
  },

  seated_press: {
    id: 'seated_press',
    names: ['Développé assis', 'Développé militaire'],
    familyId: 'vertical_push',
    zoneId: 'epaules',
    movementGroup: 'vertical_push',
    mechanics: 'compound_press',
    modality: 'barbell_or_dumbbell',
    stability: 0.64,
    loadScale: 1,
    muscles: { deltoide_anterieur: 0.42, deltoide_lateral: 0.2, triceps: 0.3, haut_pectoraux: 0.08 }
  },
  shoulder_press_machine: {
    id: 'shoulder_press_machine',
    names: ['Shoulder press machine'],
    familyId: 'vertical_push',
    zoneId: 'epaules',
    movementGroup: 'vertical_push',
    mechanics: 'compound_press',
    modality: 'machine',
    stability: 0.9,
    loadScale: 1.08,
    muscles: { deltoide_anterieur: 0.44, deltoide_lateral: 0.2, triceps: 0.3, haut_pectoraux: 0.06 }
  },
  dumbbell_seated_press: {
    id: 'dumbbell_seated_press',
    names: ['Développé haltères assis'],
    familyId: 'vertical_push',
    zoneId: 'epaules',
    movementGroup: 'vertical_push',
    mechanics: 'compound_press',
    modality: 'dumbbell',
    stability: 0.55,
    loadScale: 0.75,
    muscles: { deltoide_anterieur: 0.42, deltoide_lateral: 0.22, triceps: 0.28, haut_pectoraux: 0.08 }
  },
  lateral_raise: {
    id: 'lateral_raise',
    names: ['Élévation latérale assise avec haltère', 'Élévation latérale unilatérale avec câble'],
    familyId: 'vertical_push',
    zoneId: 'epaules',
    movementGroup: 'shoulder_isolation',
    mechanics: 'isolation',
    modality: 'dumbbell_or_cable',
    stability: 0.65,
    loadScale: 0.22,
    muscles: { deltoide_lateral: 0.78, trapezes: 0.12, deltoide_anterieur: 0.1 }
  },
  front_raise_cable: {
    id: 'front_raise_cable',
    names: ['Élévation frontale à la corde'],
    familyId: 'vertical_push',
    zoneId: 'epaules',
    movementGroup: 'shoulder_isolation',
    mechanics: 'isolation',
    modality: 'cable',
    stability: 0.72,
    loadScale: 0.22,
    muscles: { deltoide_anterieur: 0.78, haut_pectoraux: 0.1, trapezes: 0.12 }
  },

  leg_press_45: {
    id: 'leg_press_45',
    names: ['Leg press 45° ou squat Smith', 'Leg press 45°'],
    familyId: 'leg_press_pattern',
    zoneId: 'jambes',
    movementGroup: 'leg_press_pattern',
    mechanics: 'compound_leg_press',
    modality: 'machine',
    stability: 0.92,
    loadScale: 1.35,
    muscles: { quadriceps: 0.5, fessiers: 0.3, ischios: 0.12, adducteurs: 0.05, mollets: 0.03 }
  },
  smith_squat: {
    id: 'smith_squat',
    names: ['Squat Smith', 'Squat'],
    familyId: 'leg_press_pattern',
    zoneId: 'jambes',
    movementGroup: 'leg_press_pattern',
    mechanics: 'compound_leg_press',
    modality: 'guided_bar',
    stability: 0.78,
    loadScale: 0.9,
    muscles: { quadriceps: 0.46, fessiers: 0.32, ischios: 0.12, adducteurs: 0.06, tronc: 0.04 }
  },
  hack_squat: {
    id: 'hack_squat',
    names: ['Hack squat'],
    familyId: 'leg_press_pattern',
    zoneId: 'jambes',
    movementGroup: 'leg_press_pattern',
    mechanics: 'compound_leg_press',
    modality: 'machine',
    stability: 0.88,
    loadScale: 1,
    muscles: { quadriceps: 0.56, fessiers: 0.26, ischios: 0.08, adducteurs: 0.06, mollets: 0.04 }
  },
  goblet_squat: {
    id: 'goblet_squat',
    names: ['Goblet squat'],
    familyId: 'leg_press_pattern',
    zoneId: 'jambes',
    movementGroup: 'leg_press_pattern',
    mechanics: 'compound_leg_press',
    modality: 'dumbbell',
    stability: 0.58,
    loadScale: 0.45,
    muscles: { quadriceps: 0.46, fessiers: 0.26, ischios: 0.1, adducteurs: 0.08, tronc: 0.1 }
  },
  horizontal_leg_press: {
    id: 'horizontal_leg_press',
    names: ['Presse horizontale'],
    familyId: 'leg_press_pattern',
    zoneId: 'jambes',
    movementGroup: 'leg_press_pattern',
    mechanics: 'compound_leg_press',
    modality: 'machine',
    stability: 0.92,
    loadScale: 1.15,
    muscles: { quadriceps: 0.5, fessiers: 0.28, ischios: 0.12, adducteurs: 0.06, mollets: 0.04 }
  },
  leg_extension: {
    id: 'leg_extension',
    names: ['Leg extension', 'Leg extension bilatéral', 'Extension des jambes à la machine'],
    familyId: 'knee_extension',
    zoneId: 'jambes',
    movementGroup: 'knee_extension',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.94,
    loadScale: 0.35,
    muscles: { quadriceps: 0.95, flechisseurs_hanche: 0.05 }
  },
  unilateral_leg_extension: {
    id: 'unilateral_leg_extension',
    names: ['Leg extension unilatéral'],
    familyId: 'knee_extension',
    zoneId: 'jambes',
    movementGroup: 'knee_extension',
    mechanics: 'isolation',
    modality: 'machine_unilateral',
    stability: 0.92,
    loadScale: 0.18,
    muscles: { quadriceps: 0.95, flechisseurs_hanche: 0.05 }
  },
  lying_leg_curl: {
    id: 'lying_leg_curl',
    names: ['Leg curl couché', 'Flexion des jambes couché'],
    familyId: 'knee_flexion',
    zoneId: 'jambes',
    movementGroup: 'knee_flexion',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.92,
    loadScale: 0.32,
    muscles: { ischios: 0.9, gastrocnemien: 0.1 }
  },
  seated_leg_curl: {
    id: 'seated_leg_curl',
    names: ['Leg curl assis'],
    familyId: 'knee_flexion',
    zoneId: 'jambes',
    movementGroup: 'knee_flexion',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.92,
    loadScale: 0.34,
    muscles: { ischios: 0.9, gastrocnemien: 0.1 }
  },
  standing_leg_curl: {
    id: 'standing_leg_curl',
    names: ['Leg curl debout'],
    familyId: 'knee_flexion',
    zoneId: 'jambes',
    movementGroup: 'knee_flexion',
    mechanics: 'isolation',
    modality: 'machine_unilateral',
    stability: 0.86,
    loadScale: 0.16,
    muscles: { ischios: 0.88, gastrocnemien: 0.12 }
  },
  hip_thrust: {
    id: 'hip_thrust',
    names: ['Hip thrust', 'Élévation des hanches'],
    familyId: 'hip_extension',
    zoneId: 'jambes',
    movementGroup: 'hip_extension',
    mechanics: 'compound_hip_extension',
    modality: 'barbell_or_machine',
    stability: 0.75,
    loadScale: 1,
    muscles: { fessiers: 0.62, ischios: 0.22, quadriceps: 0.06, lombaires: 0.1 }
  },
  hip_thrust_machine: {
    id: 'hip_thrust_machine',
    names: ['Hip thrust machine'],
    familyId: 'hip_extension',
    zoneId: 'jambes',
    movementGroup: 'hip_extension',
    mechanics: 'compound_hip_extension',
    modality: 'machine',
    stability: 0.9,
    loadScale: 1.1,
    muscles: { fessiers: 0.64, ischios: 0.2, quadriceps: 0.06, lombaires: 0.1 }
  },
  glute_bridge: {
    id: 'glute_bridge',
    names: ['Glute bridge'],
    familyId: 'hip_extension',
    zoneId: 'jambes',
    movementGroup: 'hip_extension',
    mechanics: 'compound_hip_extension',
    modality: 'barbell_or_bodyweight',
    stability: 0.82,
    loadScale: 0.85,
    muscles: { fessiers: 0.62, ischios: 0.2, quadriceps: 0.08, lombaires: 0.1 }
  },
  rdl: {
    id: 'rdl',
    names: ['RDL haltères', 'Soulevé de terre roumain haltères', 'Soulevé de terre'],
    familyId: 'hip_extension',
    zoneId: 'jambes',
    movementGroup: 'hip_extension',
    mechanics: 'hinge',
    modality: 'barbell_or_dumbbell',
    stability: 0.55,
    loadScale: 0.85,
    muscles: { ischios: 0.38, fessiers: 0.32, lombaires: 0.2, dorsaux: 0.1 }
  },

  barbell_curl: {
    id: 'barbell_curl',
    names: ['Curl barre ou curl machine', 'Curl barre debout'],
    familyId: 'elbow_flexion',
    zoneId: 'bras',
    movementGroup: 'elbow_flexion',
    mechanics: 'isolation',
    modality: 'barbell',
    stability: 0.72,
    loadScale: 1,
    muscles: { biceps: 0.82, brachial: 0.13, avant_bras: 0.05 }
  },
  machine_curl: {
    id: 'machine_curl',
    names: ['Curl Scott machine', 'Curl Scott à la machine ou cross'],
    familyId: 'elbow_flexion',
    zoneId: 'bras',
    movementGroup: 'elbow_flexion',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.9,
    loadScale: 0.95,
    muscles: { biceps: 0.82, brachial: 0.13, avant_bras: 0.05 }
  },
  cable_curl: {
    id: 'cable_curl',
    names: ['Curl câble', 'Curl direct au cross avec corde'],
    familyId: 'elbow_flexion',
    zoneId: 'bras',
    movementGroup: 'elbow_flexion',
    mechanics: 'isolation',
    modality: 'cable',
    stability: 0.82,
    loadScale: 0.9,
    muscles: { biceps: 0.8, brachial: 0.14, avant_bras: 0.06 }
  },
  dumbbell_curl: {
    id: 'dumbbell_curl',
    names: ['Curl haltères'],
    familyId: 'elbow_flexion',
    zoneId: 'bras',
    movementGroup: 'elbow_flexion',
    mechanics: 'isolation',
    modality: 'dumbbell',
    stability: 0.68,
    loadScale: 0.72,
    muscles: { biceps: 0.8, brachial: 0.14, avant_bras: 0.06 }
  },
  rope_pushdown: {
    id: 'rope_pushdown',
    names: ['Extension triceps à la corde', 'Extension triceps à la corde debout'],
    familyId: 'elbow_extension',
    zoneId: 'bras',
    movementGroup: 'elbow_extension',
    mechanics: 'isolation',
    modality: 'cable',
    stability: 0.84,
    loadScale: 1,
    muscles: { triceps: 0.9, deltoide_anterieur: 0.05, avant_bras: 0.05 }
  },
  bar_pushdown: {
    id: 'bar_pushdown',
    names: ['Pushdown barre'],
    familyId: 'elbow_extension',
    zoneId: 'bras',
    movementGroup: 'elbow_extension',
    mechanics: 'isolation',
    modality: 'cable',
    stability: 0.86,
    loadScale: 1.02,
    muscles: { triceps: 0.9, deltoide_anterieur: 0.05, avant_bras: 0.05 }
  },
  triceps_machine: {
    id: 'triceps_machine',
    names: ['Extension machine'],
    familyId: 'elbow_extension',
    zoneId: 'bras',
    movementGroup: 'elbow_extension',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.92,
    loadScale: 1.05,
    muscles: { triceps: 0.92, deltoide_anterieur: 0.04, avant_bras: 0.04 }
  },
  french_press: {
    id: 'french_press',
    names: ['Triceps français léger', 'Triceps français avec haltère'],
    familyId: 'elbow_extension',
    zoneId: 'bras',
    movementGroup: 'elbow_extension',
    mechanics: 'isolation',
    modality: 'dumbbell_or_barbell',
    stability: 0.62,
    loadScale: 0.72,
    muscles: { triceps: 0.88, deltoide_anterieur: 0.07, avant_bras: 0.05 }
  },

  standing_calf_machine: {
    id: 'standing_calf_machine',
    names: ['Mollets debout à la machine'],
    familyId: 'calf_raise',
    zoneId: 'mollets',
    movementGroup: 'calf_raise',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.88,
    loadScale: 1,
    muscles: { gastrocnemien: 0.72, soleaire: 0.22, stabilisateurs_pied: 0.06 }
  },
  seated_calf_machine: {
    id: 'seated_calf_machine',
    names: ['Mollets assis'],
    familyId: 'calf_raise',
    zoneId: 'mollets',
    movementGroup: 'calf_raise',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.9,
    loadScale: 0.82,
    muscles: { soleaire: 0.62, gastrocnemien: 0.32, stabilisateurs_pied: 0.06 }
  },
  calf_press: {
    id: 'calf_press',
    names: ['Presse à mollets'],
    familyId: 'calf_raise',
    zoneId: 'mollets',
    movementGroup: 'calf_raise',
    mechanics: 'isolation',
    modality: 'machine',
    stability: 0.9,
    loadScale: 1.15,
    muscles: { gastrocnemien: 0.62, soleaire: 0.32, stabilisateurs_pied: 0.06 }
  }
};

const NAME_INDEX = Object.values(EXERCISE_PROFILES).reduce((index, profile) => {
  for (const name of profile.names || []) index[normalizeExerciseName(name)] = profile.id;
  index[normalizeExerciseName(profile.id)] = profile.id;
  return index;
}, {});

export function normalizeExerciseName(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getExerciseProfile(profileId) {
  return EXERCISE_PROFILES[profileId] || null;
}

export function getExerciseProfileByName(exerciseName, fallbackFamilyId = '') {
  const exact = NAME_INDEX[normalizeExerciseName(exerciseName)];
  if (exact) return EXERCISE_PROFILES[exact];

  return Object.values(EXERCISE_PROFILES).find((profile) => profile.familyId === fallbackFamilyId) || null;
}

export function calculateExerciseTransfer({ sourceProfileId, targetProfileId, testConfidenceScore = 100 }) {
  const source = getExerciseProfile(sourceProfileId);
  const target = getExerciseProfile(targetProfileId);

  if (!source || !target) {
    return {
      coefficient: null,
      reliabilityScore: DEFAULT_CONFIDENCE_FLOOR,
      reliabilityLabel: 'non calculable',
      relation: 'profil manquant',
      reason: 'Profil source ou cible absent : utiliser RIR.'
    };
  }

  if (source.id === target.id) {
    return {
      coefficient: 1,
      reliabilityScore: Math.round(testConfidenceScore),
      reliabilityLabel: labelReliability(testConfidenceScore),
      relation: 'direct',
      reason: 'Même exercice source et cible.'
    };
  }

  const movementSimilarity = getMovementSimilarity(source, target);
  const muscleSimilarity = getMuscleSimilarity(source.muscles, target.muscles);
  const mechanicsSimilarity = source.mechanics === target.mechanics ? 1 : source.familyId === target.familyId ? 0.75 : 0.35;
  const stabilitySimilarity = 1 - Math.min(0.35, Math.abs(source.stability - target.stability) * 0.5);

  const composite = Math.max(0, Math.min(1,
    muscleSimilarity * 0.45 + movementSimilarity * 0.35 + mechanicsSimilarity * 0.12 + stabilitySimilarity * 0.08
  ));

  if (movementSimilarity === 0 || composite < 0.38) {
    return {
      coefficient: null,
      reliabilityScore: Math.round(testConfidenceScore * composite),
      reliabilityLabel: 'non transférable',
      relation: 'non transférable',
      reason: `Trop peu de similarité source → cible : muscles ${Math.round(muscleSimilarity * 100)} %, mouvement ${Math.round(movementSimilarity * 100)} %.`
    };
  }

  const rawScaleRatio = target.loadScale / source.loadScale;
  const cautionPenalty = 0.88 + composite * 0.12;
  const coefficient = roundToHundredth(rawScaleRatio * cautionPenalty);
  const reliabilityScore = Math.max(DEFAULT_CONFIDENCE_FLOOR, Math.round(testConfidenceScore * composite));

  return {
    coefficient,
    reliabilityScore,
    reliabilityLabel: labelReliability(reliabilityScore),
    relation: source.familyId === target.familyId ? 'mouvement proche' : 'transfert prudent',
    reason: `Similarité muscles ${Math.round(muscleSimilarity * 100)} % · mouvement ${Math.round(movementSimilarity * 100)} % · stabilité ${Math.round(stabilitySimilarity * 100)} %.`
  };
}

function getMovementSimilarity(source, target) {
  if (source.id === target.id) return 1;
  if (source.familyId === target.familyId) return 0.92;
  if (source.movementGroup === target.movementGroup) return 0.85;
  if (source.zoneId === target.zoneId && source.mechanics === target.mechanics) return 0.42;
  return 0;
}

function getMuscleSimilarity(sourceMuscles = {}, targetMuscles = {}) {
  const muscles = new Set([...Object.keys(sourceMuscles), ...Object.keys(targetMuscles)]);
  let overlap = 0;

  for (const muscle of muscles) {
    overlap += Math.min(sourceMuscles[muscle] || 0, targetMuscles[muscle] || 0);
  }

  return Math.max(0, Math.min(1, overlap));
}

function labelReliability(score) {
  if (score >= 80) return 'haute';
  if (score >= 60) return 'moyenne';
  if (score >= 40) return 'basse';
  return 'très basse';
}

function roundToHundredth(value) {
  return Math.round(value * 100) / 100;
}
