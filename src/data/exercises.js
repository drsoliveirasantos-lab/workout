export const EXERCISES = [
  {
    id: 'squat',
    name: 'Squat',
    pattern: 'squat',
    familyId: 'leg_press_pattern',
    transferKey: 'smith_squat',
    muscles: ['quadriceps', 'fessiers', 'ischio-jambiers', 'tronc'],
    equipment: ['barbell', 'dumbbell', 'bodyweight'],
    beginnerAlternative: 'Goblet squat',
    defaultRepRange: [6, 10],
    loadSource: 'estimated-1rm'
  },
  {
    id: 'bench_press',
    name: 'Développé couché',
    pattern: 'horizontal_push',
    familyId: 'horizontal_push',
    transferKey: 'bench_press',
    muscles: ['pectoraux', 'triceps', 'deltoïde antérieur'],
    equipment: ['barbell', 'dumbbell'],
    beginnerAlternative: 'Pompes inclinées ou développé haltères',
    defaultRepRange: [6, 12],
    loadSource: 'estimated-1rm'
  },
  {
    id: 'deadlift',
    name: 'Soulevé de terre',
    pattern: 'hinge',
    familyId: 'hip_extension',
    transferKey: 'rdl',
    muscles: ['ischio-jambiers', 'fessiers', 'dos', 'tronc'],
    equipment: ['barbell', 'dumbbell'],
    beginnerAlternative: 'Soulevé de terre roumain haltères',
    defaultRepRange: [5, 8],
    loadSource: 'estimated-1rm'
  },
  {
    id: 'overhead_press',
    name: 'Développé militaire',
    pattern: 'vertical_push',
    familyId: 'vertical_push',
    transferKey: 'seated_press',
    muscles: ['épaules', 'triceps', 'tronc'],
    equipment: ['barbell', 'dumbbell'],
    beginnerAlternative: 'Développé épaules assis haltères',
    defaultRepRange: [6, 10],
    loadSource: 'estimated-1rm'
  },
  {
    id: 'row',
    name: 'Rowing',
    pattern: 'horizontal_pull',
    familyId: 'horizontal_pull',
    transferKey: 'row_machine',
    muscles: ['grand dorsal', 'rhomboïdes', 'trapèzes', 'biceps'],
    equipment: ['barbell', 'dumbbell', 'machine'],
    beginnerAlternative: 'Rowing poulie ou rowing haltère appuyé',
    defaultRepRange: [8, 12],
    loadSource: 'estimated-1rm'
  },
  {
    id: 'pulldown',
    name: 'Tirage vertical',
    pattern: 'vertical_pull',
    familyId: 'vertical_pull',
    transferKey: 'pulldown',
    muscles: ['grand dorsal', 'biceps', 'rhomboïdes'],
    equipment: ['machine'],
    beginnerAlternative: 'Tirage vertical prise neutre',
    defaultRepRange: [8, 12],
    loadSource: 'rpe'
  },
  {
    id: 'lunge',
    name: 'Fentes',
    pattern: 'single_leg',
    familyId: 'leg_press_pattern',
    transferKey: null,
    muscles: ['quadriceps', 'fessiers', 'adducteurs', 'tronc'],
    equipment: ['bodyweight', 'dumbbell'],
    beginnerAlternative: 'Split squat assisté',
    defaultRepRange: [8, 12],
    loadSource: 'rpe'
  },
  {
    id: 'plank',
    name: 'Gainage',
    pattern: 'core',
    familyId: 'core',
    transferKey: null,
    muscles: ['tronc', 'abdominaux profonds'],
    equipment: ['bodyweight'],
    beginnerAlternative: 'Gainage genoux',
    defaultRepRange: [30, 60],
    loadSource: 'time'
  }
];

export const SPLITS = {
  2: ['full_body_a', 'full_body_b'],
  3: ['full_body_a', 'full_body_b', 'full_body_c'],
  4: ['upper_a', 'lower_a', 'upper_b', 'lower_b'],
  5: ['upper_a', 'lower_a', 'push_pull', 'lower_b', 'full_body_c']
};
