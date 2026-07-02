export const DIEGO_ADVANCED_ABCD = {
  id: 'diego_abcd_very_advanced',
  label: 'Split ABCD très avancé',
  sourceNote: 'Modèle reproduit à partir du PDF Diego workout plan : séances A-D + 25 min cardio.',
  defaultCardioMinutes: 25,
  missingSessionNote: 'Le planning du PDF montre une lettre E, mais le détail de la séance E n’est pas présent dans le PDF fourni. Le MVP génère donc A-D et ajoute E seulement comme option de rappel/mobilité si 5 jours sont demandés.',
  sessions: [
    {
      id: 'advanced_a',
      title: 'Entraînement A',
      subtitle: 'Pectoraux, triceps et abdomen',
      sourcePage: 2,
      cardioMinutes: 25,
      exercises: [
        { name: 'Développé incliné', familyId: 'horizontal_push', transferKey: 'incline_barbell_press', muscles: ['pectoraux'], prepSets: 2, validSets: 4, reps: [8, 12], warmup: '1×15-20 échauffement + 1×10-15 ajustement' },
        { name: 'Développé couché', familyId: 'horizontal_push', transferKey: 'bench_press', muscles: ['pectoraux'], prepSets: 1, validSets: 4, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Développé décliné', familyId: 'horizontal_push', transferKey: 'decline_press', muscles: ['pectoraux'], prepSets: 1, validSets: 4, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Extension triceps à la corde', familyId: 'elbow_extension', transferKey: 'rope_pushdown', muscles: ['triceps'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Extension triceps à la corde debout', familyId: 'elbow_extension', transferKey: 'rope_pushdown', muscles: ['triceps'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Triceps français avec haltère', familyId: 'elbow_extension', transferKey: 'french_press', muscles: ['triceps'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Abdominaux supérieurs sur planche', familyId: 'core', muscles: ['abdominaux'], prepSets: 0, validSets: 3, reps: ['max'], rest: '45 s', warmup: 'Ajuster à la technique' },
        { name: 'Abdominaux inférieurs', familyId: 'core', muscles: ['abdominaux'], prepSets: 0, validSets: 3, reps: ['max'], rest: '45 s', warmup: 'Ajuster à la technique' }
      ]
    },
    {
      id: 'advanced_b',
      title: 'Entraînement B',
      subtitle: 'Dos et mollets',
      sourcePage: 3,
      cardioMinutes: 25,
      exercises: [
        { name: 'Rameur courbé proné', familyId: 'horizontal_pull', transferKey: 'bent_over_row', muscles: ['dos'], prepSets: 2, validSets: 4, reps: [8, 12], warmup: '1×15-20 échauffement + 1×10-15 ajustement' },
        { name: 'Rameur bas prise triangle', familyId: 'horizontal_pull', transferKey: 'low_row_triangle', muscles: ['dos'], prepSets: 1, validSets: 4, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Rameur bas prise ouverte machine', familyId: 'horizontal_pull', transferKey: 'low_row_wide', muscles: ['dos'], prepSets: 1, validSets: 5, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Pulley avant supination', familyId: 'vertical_pull', transferKey: 'pulldown_supinated', muscles: ['dos'], prepSets: 1, validSets: 5, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Soulevé de terre', familyId: 'hip_extension', transferKey: 'rdl', muscles: ['dos', 'chaîne postérieure'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Lombaires sur banc romain', familyId: 'hip_extension', transferKey: null, muscles: ['lombaires'], prepSets: 0, validSets: 3, reps: [15, 20], warmup: 'Contrôle strict du mouvement' },
        { name: 'Mollets debout à la machine', familyId: 'calf_raise', transferKey: 'standing_calf_machine', muscles: ['mollets'], prepSets: 2, validSets: 6, reps: [8, 12], warmup: '1×15-20 échauffement + 1×10-15 ajustement' }
      ]
    },
    {
      id: 'advanced_c',
      title: 'Entraînement C',
      subtitle: 'Épaules et biceps',
      sourcePage: 4,
      cardioMinutes: 25,
      exercises: [
        { name: 'Développé assis', familyId: 'vertical_push', transferKey: 'seated_press', muscles: ['épaules'], prepSets: 2, validSets: 6, reps: [8, 12], warmup: '1×15-20 échauffement + 1×10-15 ajustement' },
        { name: 'Élévation frontale à la corde', familyId: 'vertical_push', transferKey: 'front_raise_cable', muscles: ['épaules'], prepSets: 1, validSets: 5, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Élévation latérale assise avec haltère', familyId: 'shoulder_abduction', transferKey: 'lateral_raise', muscles: ['épaules'], prepSets: 1, validSets: 5, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Élévation latérale unilatérale avec câble', familyId: 'shoulder_abduction', transferKey: 'cable_lateral_raise', muscles: ['épaules'], prepSets: 0, validSets: 4, reps: [8, 12], rest: '45 s par bras', warmup: 'Charge contrôlée' },
        { name: 'Curl barre debout', familyId: 'elbow_flexion', transferKey: 'barbell_curl', muscles: ['biceps'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Curl Scott à la machine ou cross', familyId: 'elbow_flexion', transferKey: 'machine_curl', muscles: ['biceps'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Curl direct au cross avec corde', familyId: 'elbow_flexion', transferKey: 'cable_curl', muscles: ['biceps'], prepSets: 1, validSets: 3, reps: [8, 12], warmup: '1×10-15 ajustement' }
      ]
    },
    {
      id: 'advanced_d',
      title: 'Entraînement D',
      subtitle: 'Jambes',
      sourcePage: 5,
      cardioMinutes: 25,
      exercises: [
        { name: 'Mollets debout à la machine', familyId: 'calf_raise', transferKey: 'standing_calf_machine', muscles: ['mollets'], prepSets: 2, validSets: 6, reps: [8, 12], warmup: '1×15-20 échauffement + 1×10-15 ajustement' },
        { name: 'Squat Smith', familyId: 'leg_press_pattern', transferKey: 'smith_squat', muscles: ['quadriceps', 'fessiers'], prepSets: 2, validSets: 4, reps: [8, 12], warmup: '1×15-20 échauffement + 1×10-15 ajustement' },
        { name: 'Leg press 45°', familyId: 'leg_press_pattern', transferKey: 'leg_press_45', muscles: ['quadriceps', 'fessiers'], prepSets: 1, validSets: 5, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Extension des jambes à la machine', familyId: 'knee_extension', transferKey: 'leg_extension', muscles: ['quadriceps'], prepSets: 1, validSets: 4, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Flexion des jambes couché', familyId: 'knee_flexion', transferKey: 'lying_leg_curl', muscles: ['ischio-jambiers'], prepSets: 1, validSets: 4, reps: [8, 12], warmup: '1×10-15 ajustement' },
        { name: 'Élévation des hanches', familyId: 'hip_extension', transferKey: 'hip_thrust', muscles: ['fessiers'], prepSets: 1, validSets: 4, reps: [8, 12], rest: '60 s', tempo: 'pic de contraction 2 s', warmup: '1×10-15 ajustement' }
      ]
    }
  ]
};

export function buildAdvancedSessions({ daysPerWeek }) {
  const days = Number(daysPerWeek) || 4;
  const sessions = DIEGO_ADVANCED_ABCD.sessions.map((session) => ({
    ...session,
    exercises: session.exercises.map((exercise) => ({ ...exercise }))
  }));

  if (days >= 5) {
    sessions.push({
      id: 'advanced_e_optional',
      title: 'Entraînement E optionnel',
      subtitle: 'Rappel faible + mobilité + cardio',
      sourcePage: 6,
      cardioMinutes: 25,
      optional: true,
      exercises: [
        { name: 'Rappel point faible', familyId: 'weak_point', muscles: ['point faible'], prepSets: 1, validSets: 3, reps: [10, 15], warmup: 'Choisir 1 exercice non douloureux' },
        { name: 'Abdominaux ou gainage', familyId: 'core', muscles: ['abdominaux'], prepSets: 0, validSets: 3, reps: ['max'], rest: '45 s', warmup: 'Contrôle technique' },
        { name: 'Mobilité active', familyId: 'recovery', muscles: ['récupération'], prepSets: 0, validSets: 2, reps: ['10-15 min'], warmup: 'Zone facile' }
      ]
    });
  }

  return sessions.slice(0, Math.min(Math.max(days, 4), 5));
}

export function calculateAdvancedMetrics(sessions) {
  const byMuscle = {};
  let totalValidSets = 0;
  let totalPrepSets = 0;
  let cardioMinutes = 0;

  for (const session of sessions) {
    cardioMinutes += session.cardioMinutes || 0;

    for (const exercise of session.exercises) {
      totalValidSets += exercise.validSets || 0;
      totalPrepSets += exercise.prepSets || 0;

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
    densityNote: totalValidSets >= 110
      ? 'Volume très élevé : réservé aux profils très entraînés avec récupération, sommeil et nutrition solides.'
      : 'Volume élevé : surveiller fatigue, douleurs articulaires et baisse de performance.'
  };
}
