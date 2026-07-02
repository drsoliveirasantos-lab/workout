import { generateTrainingPlan } from './engine/training.js';
import { calculateNutritionTargets, buildBudgetMenu } from './engine/nutrition.js';
import {
  buildCalibrationPlan,
  buildCalibrationZones,
  calculateCalibrationEntry,
  summarizeCalibrationCoverage
} from './engine/calibration.js';

const state = {
  calibrations: [],
  calibrationPlan: [],
  calibrationZones: []
};

const selectors = {
  profileForm: '#profile-form',
  calibrationForm: '#calibration-form',
  calibrationZone: '#calibration-zone',
  calibrationFamily: '#calibration-family',
  calibrationExercise: '#calibration-exercise',
  calibrationGuidance: '#calibration-guidance',
  calibrationList: '#calibration-list',
  result: '#result',
  generatePlan: '#generate-plan'
};

function init() {
  populateProfileRangeSelects();
  bindForms();
  refreshCalibrationPlan();
  hydrateCalibrationFieldsFromSelection({ force: true });
  renderCalibrationList();
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
    physicalProfile: form.get('physicalProfile'),
    bodyFatEstimate: form.get('bodyFatEstimate'),
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
  const calibrationZone = document.querySelector(selectors.calibrationZone);
  const calibrationFamily = document.querySelector(selectors.calibrationFamily);
  const loadDemoButton = document.querySelector('#load-demo');
  const clearCalibrationsButton = document.querySelector('#clear-calibrations');
  const generatePlanButton = document.querySelector(selectors.generatePlan);
  const calibrationGuidance = document.querySelector(selectors.calibrationGuidance);

  profileForm?.addEventListener('submit', handleGeneratePlan);
  calibrationForm?.addEventListener('submit', handleCalibrationSubmit);
  calibrationZone?.addEventListener('change', () => {
    renderMovementSelect({ force: true });
    hydrateCalibrationFieldsFromSelection({ force: true });
  });
  calibrationFamily?.addEventListener('change', () => hydrateCalibrationFieldsFromSelection({ force: true }));
  loadDemoButton?.addEventListener('click', loadDemo);
  generatePlanButton?.addEventListener('click', handleGeneratePlan);
  clearCalibrationsButton?.addEventListener('click', () => {
    state.calibrations = [];
    renderCalibrationList();
    refreshCalibrationPlan();
    renderNotice('Calibrations effacées.', 'success');
  });

  calibrationGuidance?.addEventListener('click', (event) => {
    const saveButton = event.target.closest('[data-save-inline-calibration]');
    if (saveButton) {
      saveInlineCalibration(saveButton.closest('[data-calibration-inline]'));
      return;
    }

    const selectButton = event.target.closest('[data-select-family]');
    if (!selectButton) return;

    const zoneSelect = document.querySelector(selectors.calibrationZone);
    const familySelect = document.querySelector(selectors.calibrationFamily);
    if (!zoneSelect || !familySelect) return;

    zoneSelect.value = selectButton.dataset.selectZone;
    renderMovementSelect({ force: true });
    familySelect.value = selectButton.dataset.selectFamily;
    hydrateCalibrationFieldsFromSelection({ force: true });
    renderNotice(`Sélection : ${selectButton.dataset.selectLabel || ''}`, 'success');
  });

  profileForm?.addEventListener('change', (event) => {
    if (['level', 'daysPerWeek', 'equipment', 'goal'].includes(event.target.name)) {
      refreshCalibrationPlan();
    }
  });
}

function populateProfileRangeSelects() {
  document.querySelectorAll('[data-range-select]').forEach((select) => {
    const min = Number(select.dataset.min);
    const max = Number(select.dataset.max);
    const step = Number(select.dataset.step) || 1;
    const defaultValue = select.dataset.default;
    const values = buildRange(min, max, step);
    const unit = select.name === 'age' ? 'ans' : select.name === 'heightCm' ? 'cm' : 'kg';
    setSelectOptions(select, values, defaultValue, (value) => `${formatNumber(value)} ${unit}`);
  });
}

function refreshCalibrationPlan() {
  const profile = getProfileFromForm();
  state.calibrationPlan = buildCalibrationPlan(profile);
  state.calibrationZones = buildCalibrationZones(profile);
  renderZoneSelect();
  renderMovementSelect({ force: false });
  renderCalibrationGuidance(profile);
}

function renderZoneSelect() {
  const zoneSelect = document.querySelector(selectors.calibrationZone);
  if (!zoneSelect) return;

  const previousValue = zoneSelect.value;
  const zones = state.calibrationZones.length ? state.calibrationZones : buildCalibrationZones({ level: 'beginner' });

  zoneSelect.innerHTML = zones.map((zone) => `
    <option value="${zone.id}">${zone.label}</option>
  `).join('');

  if (previousValue && zones.some((zone) => zone.id === previousValue)) {
    zoneSelect.value = previousValue;
  } else if (zones[0]) {
    zoneSelect.value = zones[0].id;
  }
}

function getSelectedZoneId() {
  return document.querySelector(selectors.calibrationZone)?.value || state.calibrationZones[0]?.id || 'pecs';
}

function getMovementOptionsForSelectedZone() {
  const selectedZoneId = getSelectedZoneId();
  return state.calibrationPlan.filter((item) => item.zoneId === selectedZoneId);
}

function renderMovementSelect({ force = false } = {}) {
  const familySelect = document.querySelector(selectors.calibrationFamily);
  if (!familySelect) return;

  const previousValue = familySelect.value;
  const options = getMovementOptionsForSelectedZone();

  familySelect.innerHTML = options.map((item) => `
    <option value="${item.familyId}">${item.movementLabel}</option>
  `).join('');

  if (!force && previousValue && options.some((item) => item.familyId === previousValue)) {
    familySelect.value = previousValue;
  } else if (options[0]) {
    familySelect.value = options[0].familyId;
  }
}

function hydrateCalibrationFieldsFromSelection({ force = false } = {}) {
  hydrateCalibrationExerciseFromSelection({ force });
  renderCalibrationSelectOptions({ force });
}

function getSelectedMovement() {
  const familySelect = document.querySelector(selectors.calibrationFamily);
  return state.calibrationPlan.find((item) => item.familyId === familySelect?.value);
}

function hydrateCalibrationExerciseFromSelection({ force = false } = {}) {
  const exerciseSelect = document.querySelector(selectors.calibrationExercise);
  if (!exerciseSelect) return;

  const selected = getSelectedMovement();
  if (!selected) return;

  const previousValue = exerciseSelect.value;
  const exercises = [selected.defaultTest, ...selected.alternatives, 'Autre exercice proche / machine équivalente'];
  const uniqueExercises = [...new Set(exercises.filter(Boolean))];

  exerciseSelect.innerHTML = uniqueExercises.map((exercise) => `
    <option value="${exercise}">${exercise}</option>
  `).join('');

  if (!force && previousValue && uniqueExercises.includes(previousValue)) {
    exerciseSelect.value = previousValue;
  } else {
    exerciseSelect.value = selected.defaultTest;
  }
}

function renderCalibrationSelectOptions({ force = false } = {}) {
  const selectedMovement = getSelectedMovement();
  const selectedFamily = selectedMovement?.familyId || 'horizontal_push';
  const weightSelect = document.querySelector('#calibration-weight');
  const repsSelect = document.querySelector('#calibration-reps');
  const rirSelect = document.querySelector('#calibration-rir');
  const painSelect = document.querySelector('#calibration-pain');

  const weightOptions = getWeightOptions(selectedFamily);
  const defaultWeight = getDefaultWeight(selectedFamily);

  setSelectOptions(weightSelect, weightOptions, defaultWeight, (value) => `${formatNumber(value)} kg`, { preserve: !force });
  setSelectOptions(repsSelect, buildRange(1, 30, 1), 8, (value) => `${formatNumber(value)} reps`, { preserve: !force });
  setSelectOptions(rirSelect, buildRange(0, 5, 1), 2, (value) => `${formatNumber(value)} RIR`, { preserve: !force });
  setSelectOptions(painSelect, buildRange(0, 10, 1), 0, (value) => `${formatNumber(value)}/10`, { preserve: !force });
}

function getWeightOptions(familyId) {
  if (['leg_press_pattern'].includes(familyId)) return buildRange(20, 300, 5);
  if (['calf_raise'].includes(familyId)) return buildRange(10, 220, 5);
  if (['shoulder_abduction'].includes(familyId)) return buildRange(2.5, 60, 2.5);
  if (['elbow_flexion', 'elbow_extension', 'knee_extension', 'knee_flexion'].includes(familyId)) return buildRange(2.5, 100, 2.5);
  if (['vertical_push'].includes(familyId)) return buildRange(5, 140, 2.5);
  return buildRange(5, 220, 2.5);
}

function getDefaultWeight(familyId) {
  if (familyId === 'leg_press_pattern') return 120;
  if (familyId === 'calf_raise') return 60;
  if (familyId === 'shoulder_abduction') return 10;
  if (['elbow_flexion', 'elbow_extension', 'knee_extension', 'knee_flexion'].includes(familyId)) return 20;
  if (familyId === 'vertical_push') return 30;
  return 60;
}

function buildRange(min, max, step) {
  const values = [];
  for (let value = min; value <= max + 0.0001; value += step) {
    values.push(Number(value.toFixed(2)));
  }
  return values;
}

function setSelectOptions(select, values, defaultValue, formatter = formatNumber, options = {}) {
  if (!select) return;

  const previousValue = select.value;
  const stringValues = values.map((value) => String(value));
  select.innerHTML = buildOptions(values, defaultValue, formatter);

  if (options.preserve && previousValue && stringValues.includes(previousValue)) {
    select.value = previousValue;
  } else if (stringValues.includes(String(defaultValue))) {
    select.value = String(defaultValue);
  } else if (values.length) {
    select.value = String(values[0]);
  }
}

function buildOptions(values, selectedValue, formatter = formatNumber) {
  return values.map((value) => `
    <option value="${value}" ${String(value) === String(selectedValue) ? 'selected' : ''}>${formatter(value)}</option>
  `).join('');
}

function buildExerciseOptions(item, selectedExercise) {
  const exercises = [item.defaultTest, ...item.alternatives, 'Autre exercice proche / machine équivalente'];
  const uniqueExercises = [...new Set(exercises.filter(Boolean))];
  return uniqueExercises.map((exercise) => `
    <option value="${exercise}" ${exercise === selectedExercise ? 'selected' : ''}>${exercise}</option>
  `).join('');
}

function formatNumber(value) {
  return Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

function getCalibrationEntry(familyId) {
  return state.calibrations.find((entry) => entry.familyId === familyId);
}

function renderCalibrationGuidance(profile = getProfileFromForm()) {
  const container = document.querySelector(selectors.calibrationGuidance);
  if (!container) return;

  const requiredCoverage = summarizeCalibrationCoverage(profile, state.calibrations);
  const dashboardProfile = { ...profile, level: 'very_advanced' };
  const dashboardPlan = buildCalibrationPlan(dashboardProfile);
  const dashboardZones = buildCalibrationZones(dashboardProfile);
  const planByFamily = Object.fromEntries(dashboardPlan.map((item) => [item.familyId, item]));
  const completedDashboard = dashboardPlan.filter((item) => getCalibrationEntry(item.familyId)).length;
  const dashboardScore = dashboardPlan.length ? Math.round((completedDashboard / dashboardPlan.length) * 100) : 0;
  const minimumLine = requiredCoverage.total === dashboardPlan.length
    ? `${completedDashboard}/${dashboardPlan.length} mouvements calibrés.`
    : `Minimum conseillé : ${requiredCoverage.completed}/${requiredCoverage.total}. Tous les groupes avancés affichés : ${completedDashboard}/${dashboardPlan.length}.`;

  container.innerHTML = `
    <article class="mini-card calibration-dashboard">
      <div>
        <strong>Tableau de calibration</strong>
        <span>${minimumLine} Les mouvements manquants seront prescrits en RIR au lieu de charge calculée.</span>
      </div>
      <div class="calibration-progress-row">
        <strong>${dashboardScore}%</strong>
        <div class="calibration-progress" aria-label="Couverture calibration ${dashboardScore}%">
          <span style="width: ${dashboardScore}%"></span>
        </div>
      </div>
    </article>
    <div class="calibration-zone-funnel">
      ${dashboardZones.map((zone, index) => {
        const doneCount = zone.availableFamilyIds.filter((familyId) => getCalibrationEntry(familyId)).length;
        const zoneScore = zone.availableFamilyIds.length ? Math.round((doneCount / zone.availableFamilyIds.length) * 100) : 0;
        return `
          <details class="calibration-zone-accordion" ${index === 0 || doneCount < zone.availableFamilyIds.length ? 'open' : ''}>
            <summary>
              <strong>${zone.label}</strong>
              <small>${doneCount}/${zone.availableFamilyIds.length} · ${zoneScore}%</small>
            </summary>
            <div class="calibration-zone-content">
              <p class="muted">${zone.description}</p>
              <div class="calibration-zone-mini-progress"><span style="width: ${zoneScore}%"></span></div>
              <div class="calibration-movement-list">
                ${zone.availableFamilyIds.map((familyId) => renderInlineCalibrationCard({ zone, item: planByFamily[familyId] })).join('')}
              </div>
            </div>
          </details>
        `;
      }).join('')}
    </div>
  `;
}

function renderInlineCalibrationCard({ zone, item }) {
  const done = getCalibrationEntry(item.familyId);
  const selectedExercise = done?.exerciseName || item.defaultTest;
  const selectedWeight = done?.inputWeight || getDefaultWeight(item.familyId);
  const selectedReps = done?.inputReps || 8;
  const selectedRir = done?.rir || 2;
  const selectedPain = done?.pain || 0;
  const selectedTechnique = done?.technique || 'clean';

  return `
    <div class="calibration-movement-item ${done ? 'is-complete' : ''}" data-calibration-inline="true" data-family-id="${item.familyId}" data-zone-id="${zone.id}">
      <div class="inline-calibration-head">
        <strong>${done ? '✓ ' : ''}${item.movementLabel}</strong>
        <small>${done ? 'test enregistré' : 'à remplir'}</small>
      </div>
      <span>${item.instruction}</span>
      <small>Exemples : ${item.defaultTest}, ${item.alternatives.join(', ')}</small>
      <div class="inline-calibration-grid">
        <label>Exercice
          <select name="inlineExercise">${buildExerciseOptions(item, selectedExercise)}</select>
        </label>
        <label>Charge
          <select name="inlineWeight">${buildOptions(getWeightOptions(item.familyId), selectedWeight, (value) => `${formatNumber(value)} kg`)}</select>
        </label>
        <label>Reps
          <select name="inlineReps">${buildOptions(buildRange(1, 30, 1), selectedReps, (value) => `${formatNumber(value)} reps`)}</select>
        </label>
        <label>RIR
          <select name="inlineRir">${buildOptions(buildRange(0, 5, 1), selectedRir, (value) => `${formatNumber(value)}`)}</select>
        </label>
        <label>Douleur
          <select name="inlinePain">${buildOptions(buildRange(0, 10, 1), selectedPain, (value) => `${formatNumber(value)}/10`)}</select>
        </label>
        <label>Technique
          <select name="inlineTechnique">
            <option value="clean" ${selectedTechnique === 'clean' ? 'selected' : ''}>Propre</option>
            <option value="unstable" ${selectedTechnique === 'unstable' ? 'selected' : ''}>Instable</option>
            <option value="failed" ${selectedTechnique === 'failed' ? 'selected' : ''}>Trop lourd</option>
          </select>
        </label>
      </div>
      <button class="btn primary mini-action" type="button" data-save-inline-calibration="true">${done ? 'Mettre à jour ce test' : 'Enregistrer ce test'}</button>
      ${done ? `<small>e1RM ≈ ${done.estimatedOneRm} kg · confiance ${done.confidence.label} (${done.confidence.score}%).</small>` : ''}
    </div>
  `;
}

function saveInlineCalibration(card) {
  if (!card) return;

  try {
    const familyId = card.dataset.familyId;
    const entry = calculateCalibrationEntry({
      familyId,
      exerciseName: card.querySelector('[name="inlineExercise"]')?.value,
      weight: card.querySelector('[name="inlineWeight"]')?.value,
      reps: card.querySelector('[name="inlineReps"]')?.value,
      rir: card.querySelector('[name="inlineRir"]')?.value,
      pain: card.querySelector('[name="inlinePain"]')?.value,
      technique: card.querySelector('[name="inlineTechnique"]')?.value
    });

    state.calibrations = state.calibrations.filter((item) => item.familyId !== entry.familyId);
    state.calibrations.push(entry);
    renderCalibrationList();
    refreshCalibrationPlan();
    renderNotice(`Test enregistré : ${entry.zoneLabel} — ${entry.movementLabel}. Couverture mise à jour.`, 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
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
    renderNotice(`Calibration ajoutée : ${entry.zoneLabel} — ${entry.movementLabel}, confiance ${entry.confidence.label}.`, 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function renderCalibrationList() {
  const container = document.querySelector(selectors.calibrationList);
  if (!container) return;

  if (!state.calibrations.length) {
    container.innerHTML = '<p class="muted">Aucune calibration ajoutée. Les charges seront prescrites en RIR quand le mouvement n’est pas calibré.</p>';
    return;
  }

  container.innerHTML = state.calibrations.map((entry) => `
    <article class="mini-card">
      <strong>${entry.zoneLabel} — ${entry.movementLabel} — ${entry.exerciseName}</strong>
      <span>${entry.inputWeight} kg × ${entry.inputReps} reps + RIR ${entry.rir}</span>
      <span>e1RM ≈ ${entry.estimatedOneRm} kg · Training Max ${entry.trainingMax} kg · confiance ${entry.confidence.label} (${entry.confidence.score}%)</span>
      <span>Plage 8-12 reps : ${entry.workingRange.low}-${entry.workingRange.high} kg</span>
      <small>${entry.recommendation}</small>
    </article>
  `).join('');
}

function handleGeneratePlan(event) {
  event?.preventDefault?.();
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
    renderNotice('Programme généré. Tu peux ouvrir les sections du résultat une par une.', 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function renderPlan(plan, nutrition, menu, profile) {
  const result = document.querySelector(selectors.result);
  if (!result) return;

  const coverage = summarizeCalibrationCoverage(profile, state.calibrations);
  result.classList.remove('empty');

  const safetyContent = plan.safety.flags.length ? `
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
  `;

  const reliabilityContent = `
    <div class="metric-grid">
      <div class="metric"><strong>${coverage.score}%</strong><span>couverture calibration</span></div>
      <div class="metric"><strong>${coverage.completed}/${coverage.total}</strong><span>mouvements calibrés</span></div>
      <div class="metric"><strong>${state.calibrations.length}</strong><span>tests enregistrés</span></div>
      <div class="metric"><strong>RIR</strong><span>fallback si non calibré</span></div>
    </div>
    <p class="muted">${coverage.message}</p>
  `;

  const trainingContent = `
    <div class="sessions-grid">
      ${plan.sessions.map(renderSession).join('')}
    </div>
  `;

  const progressionContent = `
    <ul class="clean-list">
      <li><strong>Méthode :</strong> ${plan.progression.method}</li>
      <li>${plan.progression.rule}</li>
      <li><strong>Haut du corps :</strong> ${plan.progression.upperBody}</li>
      <li><strong>Bas du corps :</strong> ${plan.progression.lowerBody}</li>
      <li><strong>Deload :</strong> ${plan.progression.deload}</li>
      <li>${plan.progression.goalNote}</li>
    </ul>
  `;

  const bodyCompositionRows = nutrition.bodyComposition ? `
      <li><strong>Profil corporel :</strong> ${nutrition.bodyComposition.label}</li>
      <li><strong>Note composition :</strong> ${nutrition.bodyComposition.note}</li>
      ${nutrition.bodyComposition.leanMassKg ? `<li><strong>Masse maigre estimée :</strong> ${nutrition.bodyComposition.leanMassKg} kg</li>` : ''}
      ${nutrition.mifflinBmr && nutrition.mifflinBmr !== nutrition.bmr ? `<li><strong>BMR Mifflin de base :</strong> ${nutrition.mifflinBmr} kcal/jour</li>` : ''}
  ` : '';

  const nutritionContent = `
    <ul class="clean-list">
      <li><strong>BMR utilisé :</strong> ${nutrition.bmr} kcal/jour</li>
      ${bodyCompositionRows}
      <li><strong>Maintenance :</strong> ${nutrition.maintenance} kcal/jour</li>
      <li><strong>Cible :</strong> ${nutrition.calories.min}-${nutrition.calories.max} kcal/jour</li>
      <li><strong>Protéines :</strong> ${nutrition.protein.min}-${nutrition.protein.max} g/jour</li>
      <li>${nutrition.calories.note}</li>
    </ul>
  `;

  const menuContent = `
    <h4>${menu.title}</h4>
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
  `;

  result.innerHTML = `
    <div class="result-header">
      <p class="eyebrow">Programme généré</p>
      <h2>${plan.title}</h2>
      <p>${plan.intensity.cardio}</p>
    </div>

    <div class="accordion-stack">
      ${renderAccordion({ title: 'Sécurité', badge: plan.safety.flags.length ? 'prudence' : 'ok', content: safetyContent, open: true })}
      ${renderAccordion({ title: 'Fiabilité des charges', badge: `${coverage.score}%`, content: reliabilityContent, open: true })}
      ${renderCalculations(plan.calculations)}
      ${renderAccordion({ title: 'Entraînement', badge: `${plan.sessions.length} séances`, content: trainingContent })}
      ${renderAccordion({ title: 'Progression', badge: plan.progression.method, content: progressionContent })}
      ${renderAccordion({ title: 'Diète / calories', badge: `${nutrition.calories.min}-${nutrition.calories.max} kcal`, content: nutritionContent })}
      ${renderAccordion({ title: 'Menu budget / journée type', badge: menu.budget, content: menuContent })}
    </div>
  `;
}

function renderAccordion({ title, badge = '', content, open = false }) {
  return `
    <details class="accordion-section" ${open ? 'open' : ''}>
      <summary class="accordion-summary">
        <span>${title}</span>
        ${badge ? `<small>${badge}</small>` : ''}
      </summary>
      <div class="accordion-content">
        ${content}
      </div>
    </details>
  `;
}

function renderCalculations(calculations) {
  if (!calculations) return '';

  const content = `
    <div class="metric-grid">
      <div class="metric"><strong>${calculations.totalValidSets}</strong><span>séries valides/semaine</span></div>
      <div class="metric"><strong>${calculations.totalPrepSets}</strong><span>séries échauffement/ajustement</span></div>
      <div class="metric"><strong>${calculations.cardioMinutes} min</strong><span>cardio/semaine</span></div>
      <div class="metric"><strong>${Object.keys(calculations.byMuscle || {}).length}</strong><span>groupes suivis</span></div>
    </div>
    <p class="muted">${calculations.densityNote}</p>
    ${calculations.missingSessionNote ? `<p class="muted">${calculations.missingSessionNote}</p>` : ''}
    ${renderMuscleVolume(calculations.byMuscle)}
  `;

  return renderAccordion({ title: calculations.title, badge: `${calculations.totalValidSets} séries`, content });
}

function renderMuscleVolume(byMuscle = {}) {
  const rows = Object.entries(byMuscle)
    .sort((a, b) => b[1] - a[1])
    .map(([muscle, sets]) => `<li><strong>${muscle}</strong><span>${sets} séries valides</span></li>`)
    .join('');

  return rows ? `<ul class="volume-list">${rows}</ul>` : '';
}

function renderSession(session) {
  const exercises = session.exercises.map((exercise) => `
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
  `).join('');

  const sessionContent = `
    <p class="muted">${session.warmup}</p>
    ${session.calculations ? `<p class="muted">Calcul séance : ${session.calculations.validSets} séries valides · ${session.calculations.prepSets} préparatoires · ${session.calculations.cardioMinutes} min cardio.</p>` : ''}
    <div class="exercise-list">${exercises}</div>
    <p class="muted">${session.cooldown}</p>
  `;

  return renderAccordion({ title: session.title, badge: `${session.exercises.length} exercices`, content: sessionContent });
}

function renderEmptyState() {
  const result = document.querySelector(selectors.result);
  if (!result) return;

  result.classList.add('empty');
  result.innerHTML = `
    <p class="eyebrow">Résultat</p>
    <h2>Remplis les étapes puis génère le programme final.</h2>
    <p>Les mouvements calibrés auront une plage de charge. Les mouvements non calibrés resteront prescrits avec une logique RIR 1-3.</p>
  `;
}

function renderNotice(message, type = 'neutral') {
  const notice = document.querySelector('#notice');
  if (!notice) return;

  notice.textContent = message;
  notice.className = `notice ${type}`;
}

function loadDemo() {
  document.querySelector('[name="age"]').value = '29';
  document.querySelector('[name="heightCm"]').value = '169';
  document.querySelector('[name="weightKg"]').value = '85';
  document.querySelector('[name="physicalProfile"]').value = 'muscular_soft';
  document.querySelector('[name="bodyFatEstimate"]').value = '18-22';
  document.querySelector('[name="level"]').value = 'very_advanced';
  document.querySelector('[name="goal"]').value = 'lean_bulk';
  document.querySelector('[name="daysPerWeek"]').value = '4';
  document.querySelector('[name="activity"]').value = 'moderate';
  document.querySelector('[name="budget"]').value = 'very_low';
  document.querySelector('[name="equipment"]').value = 'full_gym';

  refreshCalibrationPlan();
  hydrateCalibrationFieldsFromSelection({ force: true });
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
