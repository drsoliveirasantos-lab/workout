export const MOVEMENT_FAMILIES = {
  horizontal_push: {
    label: 'Pecs — développé / chest press',
    technicalLabel: 'Poussée horizontale',
    target: 'pectoraux / triceps / deltoïde antérieur',
    defaultTest: 'Développé couché',
    alternatives: ['Chest press machine', 'Développé incliné', 'Développé haltères'],
    recommendedRepRange: [5, 10],
    transfer: {
      bench_press: 1,
      incline_press: 0.85,
      decline_press: 0.95,
      chest_press_machine: 0.95,
      triceps_pushdown: null
    }
  },
  vertical_push: {
    label: 'Épaules — développé épaules',
    technicalLabel: 'Poussée verticale',
    target: 'épaules / triceps',
    defaultTest: 'Développé assis',
    alternatives: ['Shoulder press machine', 'Développé militaire', 'Développé haltères assis'],
    recommendedRepRange: [5, 10],
    transfer: {
      seated_press: 1,
      shoulder_press_machine: 0.95,
      lateral_raise: null,
      front_raise_cable: null
    }
  },
  horizontal_pull: {
    label: 'Dos — rowing',
    technicalLabel: 'Tirage horizontal',
    target: 'dos / rhomboïdes / biceps',
    defaultTest: 'Rowing machine ou rameur bas',
    alternatives: ['Rowing barre', 'Rameur bas prise triangle', 'Rowing haltère appuyé'],
    recommendedRepRange: [5, 10],
    transfer: {
      row_machine: 1,
      bent_over_row: 0.9,
      low_row_triangle: 1,
      low_row_wide: 0.9
    }
  },
  vertical_pull: {
    label: 'Dos — tirage vertical / pulley',
    technicalLabel: 'Tirage vertical',
    target: 'grand dorsal / biceps',
    defaultTest: 'Tirage vertical / pulley avant',
    alternatives: ['Tirage supination', 'Tractions assistées', 'Lat pulldown machine'],
    recommendedRepRange: [5, 10],
    transfer: {
      pulldown: 1,
      pulldown_supinated: 0.95,
      assisted_pullup: 0.85
    }
  },
  leg_press_pattern: {
    label: 'Jambes — squat / leg press',
    technicalLabel: 'Poussée jambes',
    target: 'quadriceps / fessiers',
    defaultTest: 'Leg press 45° ou squat Smith',
    alternatives: ['Squat Smith', 'Hack squat', 'Goblet squat', 'Presse horizontale'],
    recommendedRepRange: [5, 10],
    transfer: {
      leg_press_45: 1,
      smith_squat: 0.75,
      hack_squat: 0.85,
      leg_extension: null
    }
  },
  knee_extension: {
    label: 'Quadriceps — leg extension',
    technicalLabel: 'Extension du genou',
    target: 'quadriceps',
    defaultTest: 'Leg extension',
    alternatives: ['Leg extension unilatéral', 'Leg extension bilatéral', 'Extension des jambes à la machine'],
    recommendedRepRange: [8, 12],
    transfer: {
      leg_extension: 1
    }
  },
  knee_flexion: {
    label: 'Ischios — leg curl',
    technicalLabel: 'Flexion du genou',
    target: 'ischio-jambiers',
    defaultTest: 'Leg curl couché',
    alternatives: ['Leg curl assis', 'Leg curl debout'],
    recommendedRepRange: [8, 12],
    transfer: {
      lying_leg_curl: 1,
      seated_leg_curl: 0.95
    }
  },
  hip_extension: {
    label: 'Fessiers — hip thrust',
    technicalLabel: 'Extension de hanche',
    target: 'fessiers / chaîne postérieure',
    defaultTest: 'Hip thrust',
    alternatives: ['Hip thrust machine', 'Élévation des hanches', 'RDL haltères', 'Glute bridge'],
    recommendedRepRange: [6, 12],
    transfer: {
      hip_thrust: 1,
      glute_bridge: 0.9,
      rdl: 0.75
    }
  },
  elbow_flexion: {
    label: 'Biceps — curl',
    technicalLabel: 'Flexion du coude',
    target: 'biceps',
    defaultTest: 'Curl barre ou curl machine',
    alternatives: ['Curl Scott machine', 'Curl câble', 'Curl haltères'],
    recommendedRepRange: [8, 12],
    transfer: {
      barbell_curl: 1,
      machine_curl: 0.95,
      cable_curl: 0.9
    }
  },
  elbow_extension: {
    label: 'Triceps — corde / pushdown',
    technicalLabel: 'Extension du coude',
    target: 'triceps',
    defaultTest: 'Extension triceps à la corde',
    alternatives: ['Pushdown barre', 'Extension machine', 'Triceps français léger'],
    recommendedRepRange: [8, 12],
    transfer: {
      rope_pushdown: 1,
      bar_pushdown: 0.95,
      french_press: 0.85
    }
  },
  calf_raise: {
    label: 'Mollets — calf raise',
    technicalLabel: 'Flexion plantaire / mollets',
    target: 'mollets',
    defaultTest: 'Mollets debout à la machine',
    alternatives: ['Mollets assis', 'Presse à mollets'],
    recommendedRepRange: [8, 15],
    transfer: {
      standing_calf_machine: 1,
      seated_calf_machine: 0.85
    }
  }
};

export const ADVANCED_REQUIRED_FAMILIES = [
  'horizontal_push',
  'horizontal_pull',
  'vertical_pull',
  'vertical_push',
  'leg_press_pattern',
  'knee_extension',
  'knee_flexion',
  'hip_extension',
  'elbow_flexion',
  'elbow_extension',
  'calf_raise'
];

export function getRequiredFamiliesForProfile(profile) {
  const level = profile?.level || 'beginner';

  if (level === 'advanced' || level === 'very_advanced') {
    return ADVANCED_REQUIRED_FAMILIES;
  }

  if (level === 'intermediate') {
    return ['horizontal_push', 'horizontal_pull', 'vertical_push', 'leg_press_pattern', 'hip_extension'];
  }

  return ['horizontal_push', 'horizontal_pull', 'leg_press_pattern'];
}
