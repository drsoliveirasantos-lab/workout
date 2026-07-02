export const MOVEMENT_FAMILIES = {
  horizontal_push: {
    label: 'Poussée horizontale',
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
    label: 'Poussée verticale',
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
    label: 'Tirage horizontal',
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
    label: 'Tirage vertical',
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
    label: 'Poussée jambes',
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
    label: 'Extension genou',
    target: 'quadriceps',
    defaultTest: 'Extension des jambes à la machine',
    alternatives: ['Leg extension unilatéral', 'Leg extension bilatéral'],
    recommendedRepRange: [8, 12],
    transfer: {
      leg_extension: 1
    }
  },
  knee_flexion: {
    label: 'Flexion genou',
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
    label: 'Extension hanche',
    target: 'fessiers / chaîne postérieure',
    defaultTest: 'Hip thrust / élévation des hanches',
    alternatives: ['Hip thrust machine', 'RDL haltères', 'Glute bridge'],
    recommendedRepRange: [6, 12],
    transfer: {
      hip_thrust: 1,
      glute_bridge: 0.9,
      rdl: 0.75
    }
  },
  elbow_flexion: {
    label: 'Flexion coude',
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
    label: 'Extension coude',
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
    label: 'Mollets',
    target: 'triceps sural / mollets',
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
