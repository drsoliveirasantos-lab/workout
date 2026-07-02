import { generateTrainingPlan } from './engine/training.js';
import { calculateNutritionTargets, buildBudgetMenu } from './engine/nutrition.js';
import {
  buildCalibrationPlan,
  calculateCalibrationEntry,
  summarizeCalibrationCoverage
} from './engine/calibration.js';

const state = {
  calibrations: [],
  calibrationPlan: []
};

const selectors = {
  profileForm: '#profile-form',
  calibrationForm: '#calibration-form',
  calibrationFamily: '#calibration-family',
  calibrationGuidance: '#calibration-guidance',
  calibrationList: '#calibration-list',
  result: '#result'
};

function init() {
  bindForms();
  refreshCalibrationPlan();
  renderEmptyState();
}

function getProfileFromForm() {
  const formElement = document.querySelector(selectors.profileForm);
  const form = new FormData(formElement);

  return {
    sex: form.get('sex'),
    age: form.get('age'),
    heightCm: form.get('heightCm'),
    weightKg: form.get('weightKg'),
    level: form.get('level'),
    goal: form.get('goal'),
    daysPerWeek: form.get('daysPerWeek'),
    activity: form.get('activity'),
    budget: form.get('budget'),
    equipment: form.get('equipment'),
    injuries: form.get('injuries'),
    medicalFlags: form.get('medicalFlags')
  };
}

function bindForms() {
  const profileForm = document.querySelector(selectors.profileForm);
  const calibrationForm = document.querySelector(selectors.calibrationForm);
  const loadDemoButton = document.querySelector('#load-demo');
  const buildCalibrationButton = document.querySelector('#build-calibration');
  const clearCalibrationsButton = document.querySelector('#clear-calibrations');

  profileForm?.addEventListener('submit', handleProfileSubmit);
  calibrationForm?.addEventListener('submit', handleCalibrationSubmit);
  loadDemoButton?.addEventListener('click', loadDemo);
  buildCalibrationButton?.addEventListener('click', refreshCalibrationPlan);
  clearCalibrationsButton?.addEventListener('click', () => {
    state.calibrations = [];
    renderCalibrationList();
    refreshCalibrationPlan();
    renderNotice('Calibrations effacées.', 'success');
  });

  profileForm?.addEventListener('change', (event) => {
    if (['level', 'daysPerWeek', 'equipment', 'goal'].includes(event.target.name)) {
      refreshCalibrationPlan();
    }
  });
}

function refreshCalibrationPlan() {
  const profile = getProfileFromForm();
  state.calibrationPlan = buildCalibrationPlan(profile);
  renderCalibrationSelect();
  renderCalibrationGuidance(profile);
}

function renderCalibrationSelect() {
  const select = document.querySelector(selectors.calibrationFamily);
  if (!select) return;

  select.innerHTML = state.calibrationPlan.map((item) => `
    <option value="${item.familyId}">${item.label} — ${item.defaultTest}</option>
  `).join('');
}

function renderCalibrationGuidance(profile = getProfileFromForm()) {
  const container = document.querySelector(selectors.calibrationGuidance);
  if (!container) return;

  const coverage = summarizeCalibrationCoverage(profile, state.calibrations);

  container.innerHTML = `
    <article class="mini-card">
      <strong>Plan de calibration conseillé</strong>
      <span>${coverage.message}</span>
      <span>Couverture : ${coverage.score}%</span>
    </article>
    ${coverage.required.map((item) => {
      const done = state.calibrations.find((entry) => entry.familyId === item.familyId);
      return `
        <article class="mini-card ${done ? 'is-complete' : ''}">
          <strong>${done ? '✓ ' : ''}${item.label}</strong>
          <span>${item.target}</span>
          <span>${item.instruction}</span>
          <small>Alternatives : ${item.alternatives.join(', ')}</small>
        </article>
      `;
    }).join('')}
  `;
}

function handleCalibrationSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);

  try {
    const entry = calculateCalibrationEntry({
      familyId: form.get('familyId'),
      exerciseName: form.get('calibrationExercise'),
      weight: form.get('calibrationWeight'),
      reps: form.get('calibrationReps'),
      rir: form.get('calibrationRir'),
      pain: form.get('calibrationPain'),
      technique: form.get('calibrationTechnique')
    });

    state.calibrations = state.calibrations.filter((item) => item.familyId !== entry.familyId);
    state.calibrations.push(entry);
    renderCalibrationList();
    refreshCalibrationPlan();
    renderNotice(`Calibration ajoutée : ${entry.familyLabel}, confiance ${entry.confidence.label}.`, 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function renderCalibrationList() {
  const container = document.querySelector(selectors.calibrationList);
  if (!container) return;

  if (!state.calibrations.length) {
    container.innerHTML = '<p class="muted">Aucune calibration ajoutée. Les charges seront prescrites en RIR quand la famille n’est pas calibrée.</p>';
    return;
  }

  container.innerHTML = state.calibrations.map((entry) => `
    <article class="mini-card">
      <strong>${entry.familyLabel} — ${entry.exerciseName}</strong>
      <span>${entry.inputWeight} kg × ${entry.inputReps} reps + RIR ${entry.rir}</span>
      <span>e1RM ≈ ${entry.estimatedOneRm} kg · Training Max ${entry.trainingMax} kg · confiance ${entry.confidence.label} (${entry.confidence.score}%)</span>
      <span>Plage 8-12 reps : ${entry.workingRange.low}-${entry.workingRange.high} kg</span>
      <small>${entry.recommendation}</small>
    </article>
  `).join('');
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const profile = getProfileFromForm();

  try {
    const plan = generateTrainingPlan({
      profile,
      strengthTests: [],
      calibrations: state.calibrations
    });
    const nutrition = calculateNutritionTargets(profile);
    const menu = buildBudgetMenu(nutrition);
    renderPlan(plan, nutrition, menu, profile);
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function renderPlan(plan, nutrition, menu, profile) {
  const result = document.querySelector(selectors.result);
  if (!result) return;

  const coverage = summarizeCalibrationCoverage(profile, state.calibrations);
  result.classList.remove('empty');

  result.innerHTML = `
    <div class="result-header">
      <p class="eyebrow">Programme généré</p>
      <h2>${plan.title}</h2>
      <p>${plan.intensity.cardio}</p>
    </div>

    ${plan.safety.flags.length ? `
      <div class="alert alert-warning">
        <strong>Prudence médicale</strong>
        <p>${plan.safety.message}</p>
        <small>Détecté : ${plan.safety.flags.join(', ')}</small>
      </div>
    ` : `
      <div class="alert alert-neutral">
        <strong>Sécurité</strong>
        <p>${plan.safety.message}</p>
      </div>
    `}

    <section class="result-section calculations-card">
      <h3>Fiabilité des charges</h3>
      <div class="metric-grid">
        <div class="metric"><strong>${coverage.score}%</strong><span>couverture calibration</span></div>
        <div class="metric"><strong>${coverage.completed}/${coverage.total}</strong><span>familles calibrées</span></div>
        <div class="metric"><strong>${state.calibrations.length}</strong><span>tests enregistrés</span></div>
        <div class="metric"><strong>RIR</strong><span>fallback si non calibré</span></div>
      </div>
      <p class="muted">${coverage.message}</p>
    </section>

    ${renderCalculations(plan.calculations)}

    <section class="result-section">
      <h3>Entraînement</h3>
      <div class="sessions-grid">
        ${plan.sessions.map(renderSession).join('')}
      </div>
    </section>

    <section class="result-section two-columns">
      <div>
        <h3>Progression</h3>
        <ul class="clean-list">
          <li><strong>Méthode :</strong> ${plan.progression.method}</li>
          <li>${plan.progression.rule}</li>
          <li><strong>Haut du corps :</strong> ${plan.progression.upperBody}</li>
          <li><strong>Bas du corps :</strong> ${plan.progression.lowerBody}</li>
          <li><strong>Deload :</strong> ${plan.progression.deload}</li>
          <li>${plan.progression.goalNote}</li>
        </ul>
      </div>
      <div>
        <h3>Nutrition</h3>
        <ul class="clean-list">
          <li><strong>BMR estimé :</strong> ${nutrition.bmr} kcal/jour</li>
          <li><strong>Maintenance :</strong> ${nutrition.maintenance} kcal/jour</li>
          <li><strong>Cible :</strong> ${nutrition.calories.min}-${nutrition.calories.max} kcal/jour</li>
          <li><strong>Protéines :</strong> ${nutrition.protein.min}-${nutrition.protein.max} g/jour</li>
          <li>${nutrition.calories.note}</li>
        </ul>
      </div>
    </section>

    <section class="result-section">
      <h3>${menu.title}</h3>
      <p><strong>Budget indicatif :</strong> ${menu.budget}</p>
      <p class="muted">${menu.note}</p>
      <div class="food-grid">
        ${menu.staples.map((food) => `
          <article class="food-card">
            <strong>${food.name}</strong>
            <span>${food.role}</span>
            <small>${food.protein}</small>
          </article>
        `).join('')}
      </div>
      <h4>Journée type</h4>
      <ol class="clean-list ordered">
        ${menu.dayTemplate.map((item) => `<li>${item}</li>`).join('')}
      </ol>
      <p>${menu.proteinTargetText}</p>
    </section>
  `;
}

function renderCalculations(calculations) {
  if (!calculations) return '';

  return `
    <section class="result-section calculations-card">
      <h3>${calculations.title}</h3>
      <div class="metric-grid">
        <div class="metric"><strong>${calculations.totalValidSets}</strong><span>séries valides/semaine</span></div>
        <div class="metric"><strong>${calculations.totalPrepSets}</strong><span>séries échauffement/ajustement</span></div>
        <div class="metric"><strong>${calculations.cardioMinutes} min</strong><span>cardio/semaine</span></div>
        <div class="metric"><strong>${Object.keys(calculations.byMuscle || {}).length}</strong><span>groupes suivis</span></div>
      </div>
      <p class="muted">${calculations.densityNote}</p>
      ${calculations.missingSessionNote ? `<p class="muted">${calculations.missingSessionNote}</p>` : ''}
      ${renderMuscleVolume(calculations.byMuscle)}
    </section>
  `;
}

function renderMuscleVolume(byMuscle = {}) {
  const rows = Object.entries(byMuscle)
    .sort((a, b) => b[1] - a[1])
    .map(([muscle, sets]) => `<li><strong>${muscle}</strong><span>${sets} séries valides</span></li>`)
    .join('');

  return rows ? `<ul class="volume-list">${rows}</ul>` : '';
}

function renderSession(session) {
  return `
    <article class="session-card">
      <h4>${session.title}</h4>
      <p class="muted">${session.warmup}</p>
      ${session.calculations ? `<p class="muted">Calcul séance : ${session.calculations.validSets} séries valides · ${session.calculations.prepSets} préparatoires · ${session.calculations.cardioMinutes} min cardio.</p>` : ''}
      <div class="exercise-list">
        ${session.exercises.map((exercise) => `
          <div class="exercise-row">
            <div>
              <strong>${exercise.name}</strong>
              <span>${exercise.muscles.join(', ')}</span>
              <small>${exercise.supportLabel || 'Alternative débutant'} : ${exercise.alternative}</small>
              ${exercise.note ? `<small>${exercise.note}</small>` : ''}
            </div>
            <div class="exercise-dose">
              <strong>${exercise.sets}×${exercise.repRange[0]}-${exercise.repRange[1]}</strong>
              <span>${exercise.loadText}</span>
              <small>${exercise.rest}</small>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="muted">${session.cooldown}</p>
    </article>
  `;
}

function renderEmptyState() {
  const result = document.querySelector(selectors.result);
  if (!result) return;

  result.classList.add('empty');
  result.innerHTML = `
    <p class="eyebrow">Résultat</p>
    <h2>Génère les tests conseillés ou lance directement le programme.</h2>
    <p>Les familles calibrées auront une plage de charge. Les familles non calibrées resteront prescrites en RIR 1-3.</p>
  `;
}

function renderNotice(message, type = 'neutral') {
  const notice = document.querySelector('#notice');
  if (!notice) return;

  notice.textContent = message;
  notice.className = `notice ${type}`;
}

function loadDemo() {
  document.querySelector('[name="age"]').value = 29;
  document.querySelector('[name="heightCm"]').value = 169;
  document.querySelector('[name="weightKg"]').value = 85;
  document.querySelector('[name="level"]').value = 'very_advanced';
  document.querySelector('[name="goal"]').value = 'hypertrophy';
  document.querySelector('[name="daysPerWeek"]').value = 4;
  document.querySelector('[name="activity"]').value = 'moderate';
  document.querySelector('[name="budget"]').value = 'very_low';
  document.querySelector('[name="equipment"]').value = 'full_gym';

  refreshCalibrationPlan();
  state.calibrations = [
    calculateCalibrationEntry({ familyId: 'horizontal_push', exerciseName: 'Développé couché', weight: 80, reps: 8, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'leg_press_pattern', exerciseName: 'Leg press 45°', weight: 180, reps: 8, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'vertical_push', exerciseName: 'Développé assis', weight: 45, reps: 8, rir: 2, pain: 0, technique: 'clean' })
  ];
  renderCalibrationList();
  renderCalibrationGuidance(getProfileFromForm());
  renderNotice('Démo très avancée chargée avec calibrations partielles.', 'success');
}

init();
