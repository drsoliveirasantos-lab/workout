const DEFAULT_CONFIDENCE_FLOOR = 15;

const LOAD_INPUT_RULES = {
  dumbbell_press: { label: 'kg par haltère', normalizedMultiplier: 2, note: 'Haltères : indique le poids d’une seule main. Le moteur convertit en charge totale pour les transferts.' },
  incline_dumbbell_press: { label: 'kg par haltère', normalizedMultiplier: 2, note: 'Développé incliné haltères : indique le poids d’un haltère, pas le total des deux.' },
  dumbbell_seated_press: { label: 'kg par haltère', normalizedMultiplier: 2, note: 'Développé épaules haltères : indique le poids d’un haltère, puis le moteur convertit en total.' },
  dumbbell_curl: { label: 'kg par haltère', normalizedMultiplier: 2, note: 'Curl haltères bilatéral : indique le poids d’un haltère ; le transfert vers barre/câble est converti en total.' },
  lateral_raise: { label: 'kg par main', normalizedMultiplier: 1, note: 'Élévation latérale haltères : indique le poids d’une main. La charge cible reste par main/côté.' },
  cable_lateral_raise: { label: 'kg par côté', normalizedMultiplier: 1, note: 'Poulie unilatérale : indique la charge utilisée pour un côté.' },
  machine_lateral_raise: { label: 'kg machine', normalizedMultiplier: 1, note: 'Machine bilatérale : indique la charge affichée par la machine.' },
  dumbbell_row_supported: { label: 'kg par main', normalizedMultiplier: 1, note: 'Rowing haltère : indique le poids de l’haltère utilisé pour un côté.' }
};

export const EXERCISE_PROFILES = {
  bench_press: profile('bench_press', ['Développé couché'], 'horizontal_push', 'pecs', 'horizontal_push', 'compound_press', 'barbell', 0.65, 1, { pectoraux: 0.55, triceps: 0.25, deltoide_anterieur: 0.2 }),
  chest_press_machine: profile('chest_press_machine', ['Chest press machine'], 'horizontal_push', 'pecs', 'horizontal_push', 'compound_press', 'machine', 0.9, 1.05, { pectoraux: 0.58, triceps: 0.24, deltoide_anterieur: 0.18 }),
  incline_press: profile('incline_press', ['Développé incliné'], 'horizontal_push', 'pecs', 'incline_push', 'compound_press', 'barbell_or_machine', 0.7, 0.9, { pectoraux: 0.48, deltoide_anterieur: 0.3, triceps: 0.22 }),
  incline_barbell_press: profile('incline_barbell_press', ['Développé incliné barre'], 'horizontal_push', 'pecs', 'incline_push', 'compound_press', 'barbell', 0.68, 0.9, { haut_pectoraux: 0.42, pectoraux: 0.16, deltoide_anterieur: 0.24, triceps: 0.18 }),
  incline_dumbbell_press: profile('incline_dumbbell_press', ['Développé incliné haltères'], 'horizontal_push', 'pecs', 'incline_push', 'compound_press', 'dumbbell', 0.55, 0.68, { haut_pectoraux: 0.42, pectoraux: 0.16, deltoide_anterieur: 0.24, triceps: 0.18 }),
  decline_press: profile('decline_press', ['Développé décliné'], 'horizontal_push', 'pecs', 'horizontal_push', 'compound_press', 'barbell_or_machine', 0.72, 1.03, { pectoraux: 0.62, triceps: 0.24, deltoide_anterieur: 0.14 }),
  dumbbell_press: profile('dumbbell_press', ['Développé haltères'], 'horizontal_push', 'pecs', 'horizontal_push', 'compound_press', 'dumbbell', 0.55, 0.75, { pectoraux: 0.55, triceps: 0.22, deltoide_anterieur: 0.23 }),
  pec_deck: profile('pec_deck', ['Pec deck', 'Butterfly machine'], 'horizontal_push', 'pecs', 'pec_isolation', 'isolation', 'machine', 0.9, 0.42, { pectoraux: 0.82, deltoide_anterieur: 0.1, biceps: 0.08 }),
  cable_fly: profile('cable_fly', ['Écarté poulie', 'Cable fly'], 'horizontal_push', 'pecs', 'pec_isolation', 'isolation', 'cable', 0.72, 0.34, { pectoraux: 0.82, deltoide_anterieur: 0.1, biceps: 0.08 }),

  row_machine: profile('row_machine', ['Rowing machine ou rameur bas'], 'horizontal_pull', 'dos', 'horizontal_pull', 'compound_pull', 'machine', 0.86, 1, { grand_dorsal: 0.36, rhomboides: 0.24, trapezes: 0.18, biceps: 0.22 }),
  bent_over_row: profile('bent_over_row', ['Rowing barre', 'Rameur courbé proné'], 'horizontal_pull', 'dos', 'horizontal_pull', 'compound_pull', 'barbell', 0.58, 0.9, { grand_dorsal: 0.34, rhomboides: 0.23, trapezes: 0.18, biceps: 0.18, lombaires: 0.07 }),
  low_row_triangle: profile('low_row_triangle', ['Rameur bas prise triangle'], 'horizontal_pull', 'dos', 'horizontal_pull', 'compound_pull', 'cable', 0.84, 1, { grand_dorsal: 0.38, rhomboides: 0.22, trapezes: 0.15, biceps: 0.25 }),
  low_row_wide: profile('low_row_wide', ['Rameur bas prise ouverte machine'], 'horizontal_pull', 'dos', 'horizontal_pull', 'compound_pull', 'machine', 0.86, 0.95, { rhomboides: 0.28, trapezes: 0.24, grand_dorsal: 0.28, biceps: 0.2 }),
  dumbbell_row_supported: profile('dumbbell_row_supported', ['Rowing haltère appuyé'], 'horizontal_pull', 'dos', 'horizontal_pull', 'compound_pull', 'dumbbell_supported', 0.72, 0.75, { grand_dorsal: 0.38, rhomboides: 0.22, trapezes: 0.15, biceps: 0.25 }),
  high_row_machine: profile('high_row_machine', ['High row machine'], 'horizontal_pull', 'dos', 'diagonal_pull', 'compound_pull', 'machine', 0.88, 0.95, { grand_dorsal: 0.38, trapezes: 0.2, rhomboides: 0.2, biceps: 0.22 }),
  pullover_cable: profile('pullover_cable', ['Pullover poulie bras tendus'], 'vertical_pull', 'dos', 'lat_isolation', 'isolation', 'cable', 0.76, 0.35, { grand_dorsal: 0.74, triceps: 0.08, pectoraux: 0.08, grand_rond: 0.1 }),

  pulldown: profile('pulldown', ['Tirage vertical / pulley avant', 'Lat pulldown machine'], 'vertical_pull', 'dos', 'vertical_pull', 'compound_pull', 'cable_or_machine', 0.84, 1, { grand_dorsal: 0.48, biceps: 0.25, rhomboides: 0.15, trapezes: 0.12 }),
  pulldown_supinated: profile('pulldown_supinated', ['Tirage supination', 'Pulley avant supination'], 'vertical_pull', 'dos', 'vertical_pull', 'compound_pull', 'cable', 0.84, 0.95, { grand_dorsal: 0.42, biceps: 0.32, rhomboides: 0.14, trapezes: 0.12 }),
  assisted_pullup: profile('assisted_pullup', ['Tractions assistées'], 'vertical_pull', 'dos', 'vertical_pull', 'compound_pull', 'bodyweight_assisted', 0.66, 0.9, { grand_dorsal: 0.48, biceps: 0.25, rhomboides: 0.15, trapezes: 0.12 }),

  seated_press: profile('seated_press', ['Développé assis', 'Développé militaire'], 'vertical_push', 'epaules', 'vertical_push', 'compound_press', 'barbell_or_dumbbell', 0.64, 1, { deltoide_anterieur: 0.42, deltoide_lateral: 0.2, triceps: 0.3, haut_pectoraux: 0.08 }),
  shoulder_press_machine: profile('shoulder_press_machine', ['Shoulder press machine'], 'vertical_push', 'epaules', 'vertical_push', 'compound_press', 'machine', 0.9, 1.08, { deltoide_anterieur: 0.44, deltoide_lateral: 0.2, triceps: 0.3, haut_pectoraux: 0.06 }),
  dumbbell_seated_press: profile('dumbbell_seated_press', ['Développé haltères assis'], 'vertical_push', 'epaules', 'vertical_push', 'compound_press', 'dumbbell', 0.55, 0.75, { deltoide_anterieur: 0.42, deltoide_lateral: 0.22, triceps: 0.28, haut_pectoraux: 0.08 }),
  lateral_raise: profile('lateral_raise', ['Élévation latérale haltères', 'Élévation latérale assise avec haltère'], 'shoulder_abduction', 'epaules', 'shoulder_abduction', 'isolation', 'dumbbell', 0.65, 0.22, { deltoide_lateral: 0.78, trapezes: 0.12, deltoide_anterieur: 0.1 }),
  cable_lateral_raise: profile('cable_lateral_raise', ['Élévation latérale poulie', 'Élévation latérale unilatérale avec câble'], 'shoulder_abduction', 'epaules', 'shoulder_abduction', 'isolation', 'cable', 0.72, 0.2, { deltoide_lateral: 0.8, trapezes: 0.1, deltoide_anterieur: 0.1 }),
  machine_lateral_raise: profile('machine_lateral_raise', ['Élévation latérale machine'], 'shoulder_abduction', 'epaules', 'shoulder_abduction', 'isolation', 'machine', 0.9, 0.28, { deltoide_lateral: 0.82, trapezes: 0.1, deltoide_anterieur: 0.08 }),
  front_raise_cable: profile('front_raise_cable', ['Élévation frontale à la corde'], 'vertical_push', 'epaules', 'shoulder_flexion', 'isolation', 'cable', 0.72, 0.22, { deltoide_anterieur: 0.78, haut_pectoraux: 0.1, trapezes: 0.12 }),
  reverse_pec_deck: profile('reverse_pec_deck', ['Oiseau machine inversée', 'Reverse pec deck'], 'horizontal_pull', 'dos', 'rear_delt_isolation', 'isolation', 'machine', 0.9, 0.24, { deltoide_posterieur: 0.72, rhomboides: 0.14, trapezes: 0.14 }),
  face_pull: profile('face_pull', ['Face pull corde'], 'horizontal_pull', 'dos', 'rear_delt_pull', 'isolation_pull', 'cable', 0.74, 0.28, { deltoide_posterieur: 0.46, rotateurs_externes: 0.22, trapezes: 0.18, rhomboides: 0.14 }),

  leg_press_45: profile('leg_press_45', ['Leg press 45° ou squat Smith', 'Leg press 45°'], 'leg_press_pattern', 'jambes', 'leg_press_pattern', 'compound_leg_press', 'machine', 0.92, 1.35, { quadriceps: 0.5, fessiers: 0.3, ischios: 0.12, adducteurs: 0.05, mollets: 0.03 }),
  smith_squat: profile('smith_squat', ['Squat Smith', 'Squat'], 'leg_press_pattern', 'jambes', 'leg_press_pattern', 'compound_leg_press', 'guided_bar', 0.78, 0.9, { quadriceps: 0.46, fessiers: 0.32, ischios: 0.12, adducteurs: 0.06, tronc: 0.04 }),
  hack_squat: profile('hack_squat', ['Hack squat'], 'leg_press_pattern', 'jambes', 'leg_press_pattern', 'compound_leg_press', 'machine', 0.88, 1, { quadriceps: 0.56, fessiers: 0.26, ischios: 0.08, adducteurs: 0.06, mollets: 0.04 }),
  goblet_squat: profile('goblet_squat', ['Goblet squat'], 'leg_press_pattern', 'jambes', 'leg_press_pattern', 'compound_leg_press', 'dumbbell', 0.58, 0.45, { quadriceps: 0.46, fessiers: 0.26, ischios: 0.1, adducteurs: 0.08, tronc: 0.1 }),
  horizontal_leg_press: profile('horizontal_leg_press', ['Presse horizontale'], 'leg_press_pattern', 'jambes', 'leg_press_pattern', 'compound_leg_press', 'machine', 0.92, 1.15, { quadriceps: 0.5, fessiers: 0.28, ischios: 0.12, adducteurs: 0.06, mollets: 0.04 }),
  leg_extension: profile('leg_extension', ['Leg extension', 'Leg extension bilatéral', 'Extension des jambes à la machine'], 'knee_extension', 'jambes', 'knee_extension', 'isolation', 'machine', 0.94, 0.35, { quadriceps: 0.95, flechisseurs_hanche: 0.05 }),
  unilateral_leg_extension: profile('unilateral_leg_extension', ['Leg extension unilatéral'], 'knee_extension', 'jambes', 'knee_extension', 'isolation', 'machine_unilateral', 0.92, 0.18, { quadriceps: 0.95, flechisseurs_hanche: 0.05 }),
  lying_leg_curl: profile('lying_leg_curl', ['Leg curl couché', 'Flexion des jambes couché'], 'knee_flexion', 'jambes', 'knee_flexion', 'isolation', 'machine', 0.92, 0.32, { ischios: 0.9, gastrocnemien: 0.1 }),
  seated_leg_curl: profile('seated_leg_curl', ['Leg curl assis'], 'knee_flexion', 'jambes', 'knee_flexion', 'isolation', 'machine', 0.92, 0.34, { ischios: 0.9, gastrocnemien: 0.1 }),
  standing_leg_curl: profile('standing_leg_curl', ['Leg curl debout'], 'knee_flexion', 'jambes', 'knee_flexion', 'isolation', 'machine_unilateral', 0.86, 0.16, { ischios: 0.88, gastrocnemien: 0.12 }),
  hip_thrust: profile('hip_thrust', ['Hip thrust', 'Élévation des hanches'], 'hip_extension', 'jambes', 'hip_extension', 'compound_hip_extension', 'barbell_or_machine', 0.75, 1, { fessiers: 0.62, ischios: 0.22, quadriceps: 0.06, lombaires: 0.1 }),
  hip_thrust_machine: profile('hip_thrust_machine', ['Hip thrust machine'], 'hip_extension', 'jambes', 'hip_extension', 'compound_hip_extension', 'machine', 0.9, 1.1, { fessiers: 0.64, ischios: 0.2, quadriceps: 0.06, lombaires: 0.1 }),
  glute_bridge: profile('glute_bridge', ['Glute bridge'], 'hip_extension', 'jambes', 'hip_extension', 'compound_hip_extension', 'barbell_or_bodyweight', 0.82, 0.85, { fessiers: 0.62, ischios: 0.2, quadriceps: 0.08, lombaires: 0.1 }),
  rdl: profile('rdl', ['RDL haltères', 'Soulevé de terre roumain haltères', 'Soulevé de terre'], 'hip_extension', 'jambes', 'hip_extension', 'hinge', 'barbell_or_dumbbell', 0.55, 0.85, { ischios: 0.38, fessiers: 0.32, lombaires: 0.2, dorsaux: 0.1 }),

  barbell_curl: profile('barbell_curl', ['Curl barre ou curl machine', 'Curl barre debout'], 'elbow_flexion', 'bras', 'elbow_flexion', 'isolation', 'barbell', 0.72, 1, { biceps: 0.82, brachial: 0.13, avant_bras: 0.05 }),
  machine_curl: profile('machine_curl', ['Curl Scott machine', 'Curl Scott à la machine ou cross'], 'elbow_flexion', 'bras', 'elbow_flexion', 'isolation', 'machine', 0.9, 0.95, { biceps: 0.82, brachial: 0.13, avant_bras: 0.05 }),
  cable_curl: profile('cable_curl', ['Curl câble', 'Curl direct au cross avec corde'], 'elbow_flexion', 'bras', 'elbow_flexion', 'isolation', 'cable', 0.82, 0.9, { biceps: 0.8, brachial: 0.14, avant_bras: 0.06 }),
  dumbbell_curl: profile('dumbbell_curl', ['Curl haltères'], 'elbow_flexion', 'bras', 'elbow_flexion', 'isolation', 'dumbbell', 0.68, 0.72, { biceps: 0.8, brachial: 0.14, avant_bras: 0.06 }),
  rope_pushdown: profile('rope_pushdown', ['Extension triceps à la corde', 'Extension triceps à la corde debout'], 'elbow_extension', 'bras', 'elbow_extension', 'isolation', 'cable', 0.84, 1, { triceps: 0.9, deltoide_anterieur: 0.05, avant_bras: 0.05 }),
  bar_pushdown: profile('bar_pushdown', ['Pushdown barre'], 'elbow_extension', 'bras', 'elbow_extension', 'isolation', 'cable', 0.86, 1.02, { triceps: 0.9, deltoide_anterieur: 0.05, avant_bras: 0.05 }),
  triceps_machine: profile('triceps_machine', ['Extension machine'], 'elbow_extension', 'bras', 'elbow_extension', 'isolation', 'machine', 0.92, 1.05, { triceps: 0.92, deltoide_anterieur: 0.04, avant_bras: 0.04 }),
  french_press: profile('french_press', ['Triceps français léger', 'Triceps français avec haltère'], 'elbow_extension', 'bras', 'elbow_extension', 'isolation', 'dumbbell_or_barbell', 0.62, 0.72, { triceps: 0.88, deltoide_anterieur: 0.07, avant_bras: 0.05 }),

  standing_calf_machine: profile('standing_calf_machine', ['Mollets debout à la machine'], 'calf_raise', 'mollets', 'calf_raise', 'isolation', 'machine', 0.88, 1, { gastrocnemien: 0.72, soleaire: 0.22, stabilisateurs_pied: 0.06 }),
  seated_calf_machine: profile('seated_calf_machine', ['Mollets assis'], 'calf_raise', 'mollets', 'calf_raise', 'isolation', 'machine', 0.9, 0.82, { soleaire: 0.62, gastrocnemien: 0.32, stabilisateurs_pied: 0.06 }),
  calf_press: profile('calf_press', ['Presse à mollets'], 'calf_raise', 'mollets', 'calf_raise', 'isolation', 'machine', 0.9, 1.15, { gastrocnemien: 0.62, soleaire: 0.32, stabilisateurs_pied: 0.06 })
};

function profile(id, names, familyId, zoneId, movementGroup, mechanics, modality, stability, loadScale, muscles) {
  return { id, names, familyId, zoneId, movementGroup, mechanics, modality, stability, loadScale, muscles };
}

const NAME_INDEX = Object.values(EXERCISE_PROFILES).reduce((index, exerciseProfile) => {
  for (const name of exerciseProfile.names || []) index[normalizeExerciseName(name)] = exerciseProfile.id;
  index[normalizeExerciseName(exerciseProfile.id)] = exerciseProfile.id;
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

  return Object.values(EXERCISE_PROFILES).find((exerciseProfile) => exerciseProfile.familyId === fallbackFamilyId) || null;
}

export function getExerciseLoadInput(profileId) {
  const profile = getExerciseProfile(profileId);
  const rule = LOAD_INPUT_RULES[profileId];

  if (rule) return rule;

  if (profile?.modality?.includes('machine')) {
    return { label: 'kg machine', normalizedMultiplier: 1, note: 'Machine : indique la charge affichée par la machine.' };
  }

  if (profile?.modality?.includes('cable')) {
    return { label: 'kg poulie', normalizedMultiplier: 1, note: 'Poulie : indique la charge affichée sur la colonne.' };
  }

  return { label: 'kg total', normalizedMultiplier: 1, note: 'Barre, Smith ou machine guidée : indique la charge totale utilisée.' };
}

export function normalizeCalibrationLoad(profileId, rawWeight) {
  const value = Number(rawWeight);
  const rule = getExerciseLoadInput(profileId);
  return Number.isFinite(value) ? value * rule.normalizedMultiplier : value;
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
