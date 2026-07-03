import { EXERCISES, SPLITS } from '../data/exercises.js';
import { buildAdvancedSessions, calculateAdvancedMetrics, DIEGO_ADVANCED_ABCD } from '../data/advancedPrograms.js';
import { calculateExerciseTransfer, getExerciseLoadInput } from '../data/exerciseProfiles.js';

const ROUNDING_STEP_KG = 2.5;

export function roundToStep(value, step = ROUNDING_STEP_KG) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value / step) * step;
}

export function estimateOneRepMax({ weight, reps, rir = 0 }) {
  const cleanWeight = Number(weight);
  const cleanReps = Number(reps);
  const cleanRir = Math.max(0, Number(rir) || 0);
  if (!Number.isFinite(cleanWeight) || cleanWeight <= 0) throw new Error('La charge doit être supérieure à 0 kg.');
  if (!Number.isFinite(cleanReps) || cleanReps < 1 || cleanReps > 30) throw new Error('Les répétitions doivent être entre 1 et 30.');
  const effectiveReps = Math.min(cleanReps + cleanRir, 20);
  const epley = cleanWeight * (1 + effectiveReps / 30);
  const brzycki = effectiveReps < 37 ? cleanWeight * 36 / (37 - effectiveReps) : epley;
  const estimate = (epley + brzycki) / 2;
  const trainingMax = estimate * 0.9;
  return { inputWeight: cleanWeight, inputReps: cleanReps, rir: cleanRir, effectiveReps, epley: roundToStep(epley), brzycki: roundToStep(brzycki), estimatedOneRm: roundToStep(estimate), trainingMax: roundToStep(trainingMax), reliability: getReliability(effectiveReps), warning: getEstimationWarning(effectiveReps) };
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
  const advanced = level === 'advanced' || level === 'very_advanced';
  const map = {
    fat_loss: { label: 'Perte de gras avec maintien musculaire', percent: beginner ? 0.62 : advanced ? 0.7 : 0.68, repRange: [8, 12], rest: advanced ? '60-120 s selon exercice' : '60-120 s', cardio: '2-3 × 20-30 min/semaine, zone facile à modérée' },
    hypertrophy: { label: 'Hypertrophie', percent: beginner ? 0.65 : advanced ? 0.75 : 0.72, repRange: [6, 12], rest: advanced ? '60-150 s selon exercice' : '90-150 s', cardio: 'Optionnel : 1-2 séances faciles pour santé cardiovasculaire' },
    lean_bulk: { label: 'Prise de masse sèche', percent: beginner ? 0.66 : advanced ? 0.74 : 0.72, repRange: [6, 12], rest: advanced ? '60-150 s selon exercice' : '90-150 s', cardio: '1-2 séances faciles pour santé et contrôle de la prise de gras' },
    strength: { label: 'Force', percent: beginner ? 0.7 : advanced ? 0.82 : 0.78, repRange: [3, 6], rest: advanced ? '2-5 min sur les mouvements lourds' : '2-4 min', cardio: 'Faible volume cardio pour ne pas gêner la récupération' },
    recomposition: { label: 'Recomposition corporelle', percent: beginner ? 0.64 : advanced ? 0.72 : 0.7, repRange: [6, 12], rest: advanced ? '60-150 s selon exercice' : '90-150 s', cardio: '2 × 20-30 min/semaine selon récupération' },
    general_health: { label: 'Santé générale', percent: beginner ? 0.55 : advanced ? 0.65 : 0.62, repRange: [8, 15], rest: '60-120 s', cardio: 'Cardio progressif selon tolérance' }
  };
  return map[goal] || map.recomposition;
}

export function generateTrainingPlan({ profile, strengthTests = [], calibrations = [] }) {
  const level = profile.level || 'beginner';
  if (level === 'advanced' || level === 'very_advanced') return generateAdvancedPlan({ profile, calibrations });
  const days = Math.min(Math.max(Number(profile.daysPerWeek) || 3, 2), 5);
  const goal = profile.goal || 'recomposition';
  const intensity = getIntensityByGoal(goal, level);
  const split = SPLITS[days] || SPLITS[3];
  const testsByExercise = Object.fromEntries(strengthTests.map((test) => [test.exerciseId, test]));
  const sessions = split.map((sessionType, index) => buildSession({ sessionType, index, intensity, level, testsByExercise, calibrations, equipment: profile.equipment || 'basic' }));
  return { title: `${intensity.label} — ${days} séances/semaine`, level, daysPerWeek: days, goal, intensity, sessions, progression: buildProgressionRules(goal), safety: buildSafetyNotes(profile) };
}

function generateAdvancedPlan({ profile, calibrations }) {
  const level = profile.level || 'advanced';
  const days = Math.min(Math.max(Number(profile.daysPerWeek) || 4, 4), 5);
  const goal = profile.goal || 'hypertrophy';
  const sourceSessions = buildAdvancedSessions({ daysPerWeek: days, goal, profile });
  const metrics = calculateAdvancedMetrics(sourceSessions);
  const sessions = sourceSessions.map((session) => mapAdvancedSessionToUi(session, calibrations));
  const label = level === 'very_advanced' ? 'Très avancé' : 'Avancé';
  const intensity = getIntensityByGoal(goal, level);
  return { title: `${label} — ${DIEGO_ADVANCED_ABCD.label} — ${days} séances/semaine`, level, daysPerWeek: days, goal, intensity: { label: `${label} ${intensity.label.toLowerCase()}`, percent: intensity.percent, repRange: intensity.repRange, rest: '45-180 s selon exercice, rôle et objectif', cardio: `${metrics.cardioMinutes} min cardio/semaine intégrés au split dynamique.` }, sessions, calculations: { title: 'Calculs du split avancé dynamique', totalValidSets: metrics.totalValidSets, totalPrepSets: metrics.totalPrepSets, cardioMinutes: metrics.cardioMinutes, byMuscle: metrics.byMuscle, byFamily: metrics.byFamily, densityNote: metrics.densityNote, sourceNote: DIEGO_ADVANCED_ABCD.sourceNote, missingSessionNote: days >= 5 ? DIEGO_ADVANCED_ABCD.missingSessionNote : '' }, progression: buildAdvancedProgressionRules(goal, metrics), safety: buildSafetyNotes(profile) };
}

function mapAdvancedSessionToUi(session, calibrations = []) {
  const sourceLabel = session.sourceLabel || 'split avancé généré dynamiquement';
  return { id: session.id, title: session.title, type: session.id, warmup: `${session.subtitle} · ${sourceLabel}. Échauffements et ajustements inclus exercice par exercice.`, cooldown: session.cardioMinutes ? `+ ${session.cardioMinutes} min cardio facile ou incliné après la séance selon récupération.` : 'Retour au calme léger.', calculations: { validSets: sumSessionSets(session, 'validSets'), prepSets: sumSessionSets(session, 'prepSets'), cardioMinutes: session.cardioMinutes || 0 }, exercises: session.exercises.map((exercise, index) => {
    const calibration = selectBestCalibration(exercise, calibrations);
    const prescription = buildAdvancedPrescription(exercise, calibration);
    return { id: `${session.id}_${index}`, name: exercise.name, muscles: exercise.muscles || [], sets: exercise.validSets || 0, repRange: Array.isArray(exercise.reps) && exercise.reps.length === 2 ? exercise.reps : [12, 20], rest: exercise.rest || '60-90 s', loadKg: prescription.loadKg, loadText: prescription.loadText, supportLabel: 'Préparation', alternative: exercise.warmup || 'Ajustement progressif', note: [exercise.tempo, prescription.note].filter(Boolean).join(' · ') };
  }) };
}

function buildAdvancedPrescription(exercise, calibration) {
  const baseParts = [];
  if (exercise.prepSets) baseParts.push(`${exercise.prepSets} série(s) échauffement/ajustement`);
  baseParts.push(`${exercise.validSets} série(s) valides`);
  if (!calibration || !exercise.familyId || exercise.familyId === 'core') return { loadKg: null, loadText: `${baseParts.join(' · ')} · charge cible : RIR 1-2`, note: 'Mouvement non calibré : choisir la charge par RIR réel.' };
  return buildTransferPrescription({ calibration, targetProfileId: exercise.transferKey, rirFallback: 'RIR 1-2', basePrefix: `${baseParts.join(' · ')} · ` });
}

function selectBestCalibration(exercise, calibrations = []) {
  if (!exercise?.familyId || exercise.familyId === 'core') return null;
  const candidates = calibrations.filter((entry) => entry.familyId === exercise.familyId);
  if (!candidates.length) return null;
  if (!exercise.transferKey) return candidates[0];
  return candidates.map((entry) => ({
    entry,
    transfer: calculateExerciseTransfer({ sourceProfileId: entry.sourceProfileId, targetProfileId: exercise.transferKey, testConfidenceScore: entry.confidence?.score || 100 })
  })).sort((a, b) => {
    if (a.transfer.coefficient === null && b.transfer.coefficient !== null) return 1;
    if (b.transfer.coefficient === null && a.transfer.coefficient !== null) return -1;
    return b.transfer.reliabilityScore - a.transfer.reliabilityScore;
  })[0]?.entry || candidates[0];
}

function buildTransferPrescription({ calibration, targetProfileId, rirFallback, basePrefix = '' }) {
  const transfer = calculateExerciseTransfer({ sourceProfileId: calibration.sourceProfileId, targetProfileId, testConfidenceScore: calibration.confidence.score });
  if (transfer.coefficient === null) return { loadKg: null, loadText: `${basePrefix}charge cible : ${rirFallback}`, note: `Source ${calibration.exerciseName}. ${transfer.reason} Fiabilité ${transfer.reliabilityScore}% : utiliser ${rirFallback}.` };
  const lowInternal = roundToStep(calibration.workingRange.low * transfer.coefficient);
  const highInternal = roundToStep(calibration.workingRange.high * transfer.coefficient);
  const targetInput = getExerciseLoadInput(targetProfileId);
  const divisor = targetInput.normalizedMultiplier || 1;
  const lowDisplay = roundToStep(lowInternal / divisor);
  const highDisplay = roundToStep(highInternal / divisor);
  const unitLabel = targetInput.label || 'kg total';
  const loadText = divisor > 1 ? `${basePrefix}charge estimée ${lowDisplay}-${highDisplay} ${unitLabel} (${lowInternal}-${highInternal} kg internes)` : `${basePrefix}charge estimée ${lowDisplay}-${highDisplay} ${unitLabel}`;
  return { loadKg: lowDisplay, loadText, note: `Source choisie ${calibration.exerciseName} (${calibration.sourceProfileName}) · transfert ${transfer.relation} · coefficient ${transfer.coefficient} · fiabilité ${transfer.reliabilityScore}% (${transfer.reliabilityLabel}). ${transfer.reason}` };
}

function sumSessionSets(session, key) { return session.exercises.reduce((total, exercise) => total + (exercise[key] || 0), 0); }

function buildSession({ sessionType, index, intensity, level, testsByExercise, calibrations, equipment }) {
  const templates = { full_body_a: ['squat', 'bench_press', 'row', 'lunge', 'plank'], full_body_b: ['deadlift', 'overhead_press', 'pulldown', 'squat', 'plank'], full_body_c: ['squat', 'bench_press', 'row', 'deadlift', 'lunge'], upper_a: ['bench_press', 'row', 'overhead_press', 'pulldown', 'plank'], lower_a: ['squat', 'deadlift', 'lunge', 'plank'], upper_b: ['overhead_press', 'pulldown', 'bench_press', 'row', 'plank'], lower_b: ['deadlift', 'squat', 'lunge', 'plank'], push_pull: ['bench_press', 'row', 'overhead_press', 'pulldown'] };
  const exerciseIds = templates[sessionType] || templates.full_body_a;
  const exercises = exerciseIds.map((exerciseId, position) => {
    const exercise = EXERCISES.find((item) => item.id === exerciseId);
    const test = testsByExercise[exerciseId];
    const calibration = selectBestCalibration(exercise, calibrations);
    const isMainLift = position <= 2 && exercise?.loadSource === 'estimated-1rm';
    const sets = isMainLift ? (level === 'beginner' ? 3 : 4) : 2;
    const repRange = isMainLift ? intensity.repRange : exercise.defaultRepRange;
    const prescription = buildGeneralPrescription({ exercise, test, calibration, intensity });
    return { id: exerciseId, name: exercise.name, muscles: exercise.muscles, sets, repRange, rest: intensity.rest, loadKg: prescription.loadKg, loadText: prescription.loadText, supportLabel: 'Alternative débutant', alternative: exercise.beginnerAlternative, note: prescription.note };
  });
  return { id: `session_${index + 1}`, title: `Séance ${index + 1}`, type: sessionType, exercises, warmup: buildWarmup(equipment), cooldown: '5-10 min facile + mobilité légère si utile.' };
}

function buildGeneralPrescription({ exercise, test, calibration, intensity }) {
  if (test?.trainingMax) { const load = roundToStep(test.trainingMax * intensity.percent); return { loadKg: load, loadText: `${load} kg`, note: `Charge calculée depuis Training Max ${test.trainingMax} kg.` }; }
  if (calibration && exercise.familyId && exercise.familyId !== 'core') return buildTransferPrescription({ calibration, targetProfileId: exercise.transferKey, rirFallback: 'RIR 2-3', basePrefix: '' });
  if (exercise.familyId === 'core' || exercise.loadSource === 'time') return { loadKg: null, loadText: 'Poids du corps / temps contrôlé', note: 'Pas besoin de test de charge pour cet exercice.' };
  return { loadKg: null, loadText: 'Choisir une charge à RIR 2-3', note: 'Mouvement non calibré : utiliser RIR puis enregistrer la charge après la séance.' };
}

function buildWarmup(equipment) { return equipment === 'bodyweight' ? '5-8 min cardio léger + 2 séries progressives au poids du corps.' : '5-8 min cardio léger + séries de chauffe progressives avant les mouvements principaux.'; }

function buildProgressionRules(goal) {
  return { method: goal === 'lean_bulk' ? 'Double progression contrôlée' : 'Double progression', rule: 'Quand toutes les séries atteignent le haut de la fourchette avec technique propre, augmenter la charge à la prochaine séance.', upperBody: '+2 à +2,5 kg ou +2,5 à 5 %', lowerBody: '+2,5 à +5 kg ou +5 à 10 %', deload: 'Si fatigue élevée, douleur ou baisse de performance sur 2 séances : réduire le volume de 20-40 % pendant 1 semaine.', goalNote: goal === 'fat_loss' ? 'En déficit calorique, la priorité est de maintenir la force et la technique plutôt que de forcer la progression.' : goal === 'lean_bulk' ? 'Prise de masse sèche : viser une progression lente, un surplus faible et un suivi du poids pour limiter la prise de gras.' : 'La progression doit rester lente, mesurable et compatible avec la récupération.' };
}

function buildAdvancedProgressionRules(goal, metrics) {
  return { method: goal === 'lean_bulk' ? 'Double progression avancée contrôlée' : 'Double progression avancée', rule: 'Sur les séries valides : quand toutes les séries atteignent le haut de la fourchette avec RIR 1-2 et technique propre, augmenter légèrement la charge.', upperBody: '+1 à +2,5 kg ou +2,5 à 5 % selon machine/haltère/barre', lowerBody: '+2,5 à +5 kg ou +5 à 10 % selon exercice et tolérance articulaire', deload: 'Deload recommandé si performance en baisse sur 2 séances, sommeil bas, douleurs articulaires ou fatigue persistante : -30 à -50 % de séries valides pendant 5-7 jours.', goalNote: `${metrics.totalValidSets} séries valides/semaine dans ce split dynamique. ${goal === 'fat_loss' ? 'En déficit, réduire le volume avant de forcer les charges.' : goal === 'lean_bulk' ? 'En prise de masse sèche, suivre poids/tour de taille et réduire le surplus si le gras monte trop vite.' : 'Ajuster le volume selon récupération et douleurs articulaires.'}` };
}

function buildSafetyNotes(profile) {
  const flags = [];
  const text = `${profile.medicalFlags || ''} ${profile.injuries || ''}`.toLowerCase();
  ['douleur aiguë', 'blessure', 'rupture', 'hypertension', 'malaise'].forEach((term) => { if (text.includes(term)) flags.push(term); });
  return { flags, message: flags.length ? 'Profil avec élément de prudence : demander un avis professionnel avant de suivre un programme intensif.' : 'Aucun signal de prudence déclaré. Arrêter l’exercice en cas de douleur aiguë, malaise ou symptôme inhabituel.' };
}
