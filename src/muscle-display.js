import { getExerciseProfileByName } from './data/exerciseProfiles.js';

const MUSCLE_LABELS = {
  pectoraux: 'Pectoraux',
  haut_pectoraux: 'Haut des pectoraux',
  triceps: 'Triceps',
  deltoide_anterieur: 'Deltoïde antérieur',
  deltoide_lateral: 'Deltoïde latéral',
  deltoide_posterieur: 'Deltoïde postérieur',
  grand_dorsal: 'Grand dorsal',
  grand_rond: 'Grand rond',
  rhomboides: 'Rhomboïdes',
  trapezes: 'Trapèzes',
  biceps: 'Biceps',
  brachial: 'Brachial',
  avant_bras: 'Avant-bras',
  rotateurs_externes: 'Rotateurs externes',
  quadriceps: 'Quadriceps',
  fessiers: 'Fessiers',
  ischios: 'Ischios',
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

function initMuscleDisplay() {
  const container = document.querySelector('#calibration-guidance');
  if (!container) return;

  enhanceAllCalibrationCards(container);

  container.addEventListener('change', (event) => {
    if (event.target?.name === 'inlineExercise') {
      enhanceCalibrationCard(event.target.closest('[data-calibration-inline]'), { force: true });
    }
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
  const select = card.querySelector('[name="inlineExercise"]');
  const exerciseName = select?.value;
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
  const rows = Object.entries(profile.muscles || {})
    .sort((a, b) => b[1] - a[1])
    .map(([muscleId, ratio]) => {
      const percent = Math.round(ratio * 100);
      return `
        <li>
          <span>${MUSCLE_LABELS[muscleId] || humanizeMuscleId(muscleId)}</span>
          <strong>${percent}%</strong>
        </li>
      `;
    })
    .join('');

  return `
    <strong>Répartition musculaire indicative</strong>
    <ul>${rows}</ul>
    <small>Ces pourcentages servent au score de transfert : plus deux exercices partagent les mêmes muscles et le même mouvement, plus la charge estimée est fiable.</small>
  `;
}

function humanizeMuscleId(id) {
  return String(id)
    .replace(/_/g, ' ')
    .replace(/^./, (letter) => letter.toUpperCase());
}

initMuscleDisplay();
