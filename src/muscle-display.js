import { getExerciseProfileByName } from './data/exerciseProfiles.js';

const MUSCLE_LABELS = {
  pectoraux: 'Pectoraux',
  haut_pectoraux: 'Haut des pectoraux',
  pec_claviculaire: 'Pectoral faisceau claviculaire',
  pec_sternal: 'Pectoral faisceau sternal',
  pec_costal: 'Pectoral faisceau costal/inférieur',
  triceps: 'Triceps',
  triceps_lateral: 'Triceps chef latéral',
  triceps_medial: 'Triceps chef médial',
  triceps_long: 'Triceps longue portion',
  deltoide_anterieur: 'Deltoïde antérieur',
  deltoide_lateral: 'Deltoïde latéral',
  deltoide_posterieur: 'Deltoïde postérieur',
  stabilisateurs_epaule: 'Stabilisateurs de l’épaule',
  grand_dorsal: 'Grand dorsal',
  grand_rond: 'Grand rond',
  rhomboides: 'Rhomboïdes',
  trapezes: 'Trapèzes',
  biceps: 'Biceps',
  biceps_court: 'Biceps chef court',
  biceps_long: 'Biceps chef long',
  brachial: 'Brachial',
  avant_bras: 'Avant-bras',
  rotateurs_externes: 'Rotateurs externes',
  quadriceps: 'Quadriceps',
  vaste_lateral: 'Vaste latéral',
  vaste_medial: 'Vaste médial',
  droit_femoral: 'Droit fémoral',
  vaste_intermediaire: 'Vaste intermédiaire',
  fessiers: 'Fessiers',
  grand_fessier: 'Grand fessier',
  moyen_fessier: 'Moyen fessier',
  ischios: 'Ischios',
  biceps_femoral: 'Biceps fémoral',
  semi_tendineux: 'Semi-tendineux',
  semi_membraneux: 'Semi-membraneux',
  adducteurs: 'Adducteurs',
  mollets: 'Mollets',
  tronc: 'Tronc / gainage',
  lombaires: 'Lombaires',
  dorsaux: 'Dorsaux',
  flechisseurs_hanche: 'Fléchisseurs de hanche',
  gastrocnemien: 'Gastrocnémien',
  soleaire: 'Soléaire',
  stabilisateurs_pied: 'Stabilisateurs du pied'
};

const ANATOMY_DETAILS = {
  bench_press: { pec_claviculaire: 0.12, pec_sternal: 0.32, pec_costal: 0.11, triceps_lateral: 0.09, triceps_medial: 0.08, triceps_long: 0.08, deltoide_anterieur: 0.2 },
  incline_barbell_press: { pec_claviculaire: 0.36, pec_sternal: 0.13, pec_costal: 0.03, deltoide_anterieur: 0.24, triceps_lateral: 0.08, triceps_medial: 0.08, triceps_long: 0.08 },
  incline_dumbbell_press: { pec_claviculaire: 0.34, pec_sternal: 0.13, pec_costal: 0.03, deltoide_anterieur: 0.25, triceps_lateral: 0.07, triceps_medial: 0.07, triceps_long: 0.07, stabilisateurs_epaule: 0.04 },
  decline_press: { pec_claviculaire: 0.06, pec_sternal: 0.28, pec_costal: 0.28, triceps_lateral: 0.09, triceps_medial: 0.08, triceps_long: 0.07, deltoide_anterieur: 0.14 },
  pec_deck: { pec_claviculaire: 0.2, pec_sternal: 0.42, pec_costal: 0.2, deltoide_anterieur: 0.1, biceps_court: 0.04, biceps_long: 0.04 },
  cable_fly: { pec_claviculaire: 0.22, pec_sternal: 0.4, pec_costal: 0.2, deltoide_anterieur: 0.1, biceps_court: 0.04, biceps_long: 0.04 },
  hack_squat: { vaste_lateral: 0.2, vaste_medial: 0.16, droit_femoral: 0.11, vaste_intermediaire: 0.09, grand_fessier: 0.2, moyen_fessier: 0.06, ischios: 0.08, adducteurs: 0.06, mollets: 0.04 },
  leg_press_45: { vaste_lateral: 0.18, vaste_medial: 0.14, droit_femoral: 0.1, vaste_intermediaire: 0.08, grand_fessier: 0.22, moyen_fessier: 0.08, ischios: 0.12, adducteurs: 0.05, mollets: 0.03 },
  leg_extension: { vaste_lateral: 0.3, vaste_medial: 0.25, droit_femoral: 0.22, vaste_intermediaire: 0.18, flechisseurs_hanche: 0.03, tronc: 0.02 },
  lying_leg_curl: { biceps_femoral: 0.42, semi_tendineux: 0.22, semi_membraneux: 0.22, gastrocnemien: 0.1, fessiers: 0.04 },
  seated_leg_curl: { biceps_femoral: 0.38, semi_tendineux: 0.25, semi_membraneux: 0.25, gastrocnemien: 0.08, fessiers: 0.04 },
  hip_thrust: { grand_fessier: 0.46, moyen_fessier: 0.12, ischios: 0.22, lombaires: 0.1, quadriceps: 0.06, adducteurs: 0.04 }
};

function initMuscleDisplay() {
  const container = document.querySelector('#calibration-guidance');
  if (!container) return;
  enhanceAllCalibrationCards(container);
  container.addEventListener('change', (event) => {
    if (event.target?.name === 'inlineExercise') enhanceCalibrationCard(event.target.closest('[data-calibration-inline]'), { force: true });
  });
  const observer = new MutationObserver(() => enhanceAllCalibrationCards(container));
  observer.observe(container, { childList: true, subtree: true });
}

function enhanceAllCalibrationCards(container) {
  container.querySelectorAll('[data-calibration-inline]').forEach((card) => enhanceCalibrationCard(card));
}

function enhanceCalibrationCard(card, { force = false } = {}) {
  if (!card) return;
  const familyId = card.dataset.familyId;
  const exerciseName = card.querySelector('[name="inlineExercise"]')?.value;
  const profile = getExerciseProfileByName(exerciseName, familyId);
  const item = card.querySelector('.calibration-movement-item');
  if (!item || !profile) return;

  let box = item.querySelector('.muscle-distribution');
  if (!box) {
    box = document.createElement('div');
    box.className = 'muscle-distribution';
    const grid = item.querySelector('.inline-calibration-grid');
    item.insertBefore(box, grid || item.firstChild);
  }
  if (!force && box.dataset.profileId === profile.id) return;
  box.dataset.profileId = profile.id;
  box.innerHTML = renderMuscleDistribution(profile);
}

function renderMuscleDistribution(profile) {
  const macroRows = renderRows(profile.muscles || {});
  const anatomy = ANATOMY_DETAILS[profile.id] || null;
  const detailRows = anatomy ? renderRows(anatomy) : '';
  return `
    <strong>Répartition biomécanique indicative utilisée par le moteur</strong>
    <small>Niveau 1 — groupes principaux</small>
    <ul>${macroRows}</ul>
    ${detailRows ? `<small>Niveau 2 — détail anatomique</small><ul>${detailRows}</ul>` : '<small>Détail anatomique fin non encore renseigné pour cette variante.</small>'}
    <small>Ces valeurs ne sont pas une mesure EMG exacte : elles guident seulement le score de transfert et la fiabilité de charge.</small>
  `;
}

function renderRows(map) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([muscleId, ratio]) => `
    <li><span>${MUSCLE_LABELS[muscleId] || humanizeMuscleId(muscleId)}</span><strong>${Math.round(ratio * 100)}%</strong></li>
  `).join('');
}

function humanizeMuscleId(id) {
  return String(id).replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
}

initMuscleDisplay();
