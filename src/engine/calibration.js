import { CALIBRATION_ZONES, MOVEMENT_FAMILIES, getRequiredFamiliesForProfile } from '../data/movementFamilies.js';
import { estimateOneRepMax, roundToStep } from './training.js';

export function buildCalibrationPlan(profile) {
  const requiredFamilyIds = getRequiredFamiliesForProfile(profile);

  return requiredFamilyIds.map((familyId) => {
    const family = MOVEMENT_FAMILIES[familyId];
    return {
      familyId,
      zoneId: family.zoneId,
      zoneLabel: family.zoneLabel,
      label: family.label,
      movementLabel: family.movementLabel,
      technicalLabel: family.technicalLabel,
      target: family.target,
      defaultTest: family.defaultTest,
      alternatives: family.alternatives,
      recommendedRepRange: family.recommendedRepRange,
      instruction: `Choisis une charge pour ${family.defaultTest} que tu peux faire entre ${family.recommendedRepRange[0]} et ${family.recommendedRepRange[1]} répétitions propres avec RIR 1-2.`
    };
  });
}

export function buildCalibrationZones(profile) {
  const plan = buildCalibrationPlan(profile);
  const availableFamilyIds = new Set(plan.map((item) => item.familyId));

  return CALIBRATION_ZONES
    .map((zone) => ({
      ...zone,
      availableFamilyIds: zone.familyIds.filter((familyId) => availableFamilyIds.has(familyId))
    }))
    .filter((zone) => zone.availableFamilyIds.length > 0);
}

export function calculateCalibrationEntry({ familyId, exerciseName, weight, reps, rir, pain = 0, technique = 'clean' }) {
  const family = MOVEMENT_FAMILIES[familyId];
  if (!family) throw new Error('Famille de mouvement inconnue.');

  const estimate = estimateOneRepMax({ weight, reps, rir });
  const confidence = getCalibrationConfidence({ reps: estimate.effectiveReps, pain, technique });

  return {
    familyId,
    zoneId: family.zoneId,
    zoneLabel: family.zoneLabel,
    movementLabel: family.movementLabel,
    technicalLabel: family.technicalLabel,
    familyLabel: family.label,
    exerciseName: exerciseName || family.defaultTest,
    target: family.target,
    pain: Number(pain) || 0,
    technique,
    ...estimate,
    confidence,
    workingRange: calculateWorkingRange({ trainingMax: estimate.trainingMax, confidence }),
    recommendation: buildCalibrationRecommendation({ confidence, pain: Number(pain) || 0, technique })
  };
}

function getCalibrationConfidence({ reps, pain, technique }) {
  let score = 100;
  const reasons = [];

  if (reps < 5) {
    score -= 20;
    reasons.push('test trop lourd ou trop peu de répétitions');
  }

  if (reps > 12) {
    score -= 15;
    reasons.push('test assez long, estimation plus variable');
  }

  if (reps > 15) {
    score -= 25;
    reasons.push('au-delà de 15 répétitions, la formule devient moins fiable');
  }

  if (pain >= 4) {
    score -= 35;
    reasons.push('douleur déclarée pendant le test');
  } else if (pain > 0) {
    score -= 10;
    reasons.push('douleur légère déclarée');
  }

  if (technique !== 'clean') {
    score -= 25;
    reasons.push('technique non totalement propre');
  }

  const bounded = Math.max(10, Math.min(100, score));

  return {
    score: bounded,
    label: bounded >= 80 ? 'haute' : bounded >= 55 ? 'moyenne' : 'basse',
    reasons: reasons.length ? reasons : ['test dans une zone exploitable']
  };
}

function calculateWorkingRange({ trainingMax, confidence }) {
  const lowPercent = confidence.score >= 80 ? 0.62 : confidence.score >= 55 ? 0.55 : 0.5;
  const highPercent = confidence.score >= 80 ? 0.76 : confidence.score >= 55 ? 0.7 : 0.62;

  return {
    low: roundToStep(trainingMax * lowPercent),
    high: roundToStep(trainingMax * highPercent),
    note: 'Plage initiale pour séries valides de 8-12 reps, à ajuster selon RIR réel.'
  };
}

function buildCalibrationRecommendation({ confidence, pain, technique }) {
  if (pain >= 4) {
    return 'Douleur significative : ne pas utiliser ce test comme base de charge. Réduire, remplacer l’exercice ou demander un avis professionnel.';
  }

  if (technique !== 'clean') {
    return 'Technique incertaine : refaire la calibration plus léger avant de charger les séries valides.';
  }

  if (confidence.score < 55) {
    return 'Fiabilité basse : utiliser uniquement une charge prudente en RIR 2-3 et recalibrer à la prochaine séance.';
  }

  return 'Calibration utilisable : démarrer dans la plage proposée et ajuster selon les séries réellement réalisées.';
}

export function summarizeCalibrationCoverage(profile, calibrationEntries) {
  const required = buildCalibrationPlan(profile);
  const entriesByFamily = Object.fromEntries(calibrationEntries.map((entry) => [entry.familyId, entry]));
  const missing = required.filter((item) => !entriesByFamily[item.familyId]);
  const completed = required.length - missing.length;

  return {
    required,
    zones: buildCalibrationZones(profile),
    missing,
    completed,
    total: required.length,
    score: required.length ? Math.round((completed / required.length) * 100) : 0,
    message: missing.length
      ? `${completed}/${required.length} mouvements calibrés. Les mouvements manquants seront prescrits en RIR au lieu de charge calculée.`
      : 'Tous les mouvements importants sont calibrés pour ce programme.'
  };
}
