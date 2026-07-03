import { generateTrainingPlan } from './engine/training.js';
import { calculateNutritionTargets, buildBudgetMenu } from './engine/nutrition.js';
import {
  buildCalibrationPlan,
  buildCalibrationZones,
  calculateCalibrationEntry,
  summarizeCalibrationCoverage
} from './engine/calibration.js';
import { getExerciseLoadInput, getExerciseProfileByName } from './data/exerciseProfiles.js';

const STORAGE_KEY = 'workout-nykuto-plan-v1';

const state = {
  calibrations: [],
  calibrationPlan: [],
  calibrationZones: [],
  currentPlan: null,
  currentNutrition: null,
  currentMenu: null,
  currentProfile: null,
  hasSavedPlan: false,
  sessionIndex: 0,
  workoutLog: {},
  uxMode: 'advanced'
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
  restoreSavedState();
  refreshCalibrationPlan();
  hydrateCalibrationFieldsFromSelection({ force: true });
  renderCalibrationList();
  updateSavedPlanControls();
  applyUxMode(state.uxMode);

  if (state.hasSavedPlan) {
    regenerateSavedPlan({ silent: true });
  } else {
    renderEmptyState();
  }
}

function getProfileFromForm() {
  syncDerivedProfileFields();
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
  const resumePlanButton = document.querySelector('#resume-plan');
  const clearSavedButton = document.querySelector('#clear-saved-plan');
  const calibrationGuidance = document.querySelector(selectors.calibrationGuidance);
  const result = document.querySelector(selectors.result);

  profileForm?.addEventListener('submit', handleGeneratePlan);
  calibrationForm?.addEventListener('submit', handleCalibrationSubmit);
  calibrationZone?.addEventListener('change', () => {
    renderMovementSelect({ force: true });
    hydrateCalibrationFieldsFromSelection({ force: true });
    saveDraft();
  });
  calibrationFamily?.addEventListener('change', () => {
    hydrateCalibrationFieldsFromSelection({ force: true });
    saveDraft();
  });
  loadDemoButton?.addEventListener('click', loadDemo);
  generatePlanButton?.addEventListener('click', handleGeneratePlan);
  resumePlanButton?.addEventListener('click', () => regenerateSavedPlan({ silent: false }));
  clearSavedButton?.addEventListener('click', clearSavedPlan);

  clearCalibrationsButton?.addEventListener('click', () => {
    state.calibrations = [];
    renderCalibrationList();
    refreshCalibrationPlan();
    saveDraft({ hasSavedPlan: false });
    updateSavedPlanControls();
    renderNotice('Calibrations effacées.', 'success');
  });

  calibrationGuidance?.addEventListener('click', (event) => {
    const saveButton = event.target.closest('[data-save-inline-calibration]');
    if (saveButton) {
      saveInlineCalibration(saveButton.closest('[data-calibration-inline]'));
      return;
    }
  });

  profileForm?.addEventListener('input', () => {
    syncDerivedProfileFields();
    saveDraft({ hasSavedPlan: false });
    updateSavedPlanControls();
  });

  profileForm?.addEventListener('change', (event) => {
    syncDerivedProfileFields();
    if (['level', 'daysPerWeek', 'equipment', 'goal', 'priorityMuscleUi', 'recoveryLevelUi', 'exercisePreferenceUi', 'painZoneUi'].includes(event.target.name)) {
      refreshCalibrationPlan();
    }
    saveDraft({ hasSavedPlan: false });
    updateSavedPlanControls();
  });

  document.querySelectorAll('[data-set-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      applyUxMode(button.dataset.setMode || 'advanced');
      saveDraft();
    });
  });

  result?.addEventListener('click', handleResultInteraction);
  result?.addEventListener('change', handleResultChange);
}

function populateProfileRangeSelects() {
  document.querySelectorAll('[data-range-select]').forEach((select) => {
    const min = Number(select.dataset.min);
    const max = Number(select.dataset.max);
    const step = Number(select.dataset.step) || 1;
    const defaultValue = select.dataset.default;
    const unit = select.name === 'age' ? 'ans' : select.name === 'heightCm' ? 'cm' : 'kg';
    setSelectOptions(select, buildRange(min, max, step), defaultValue, (value) => `${formatNumber(value)} ${unit}`);
  });
}

function syncDerivedProfileFields() {
  const form = document.querySelector(selectors.profileForm);
  if (!form) return;
  const val = (name) => form.querySelector(`[name="${name}"]`)?.value || '';
  const injuries = form.querySelector('[name="injuries"]');
  const flags = form.querySelector('[name="medicalFlags"]');
  if (injuries) injuries.value = [`pain:${val('painZoneUi') || 'none'}`, val('injuriesText')].filter(Boolean).join('; ');
  if (flags) flags.value = [`priority:${val('priorityMuscleUi') || 'balanced'}`, `recovery:${val('recoveryLevelUi') || 'normal'}`, `preference:${val('exercisePreferenceUi') || 'mixed'}`, val('medicalFlagsText')].filter(Boolean).join('; ');
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
  zoneSelect.innerHTML = zones.map((zone) => `<option value="${zone.id}">${zone.label}</option>`).join('');
  zoneSelect.value = zones.some((zone) => zone.id === previousValue) ? previousValue : zones[0]?.id || 'pecs';
}

function getSelectedZoneId() {
  return document.querySelector(selectors.calibrationZone)?.value || state.calibrationZones[0]?.id || 'pecs';
}

function getMovementOptionsForSelectedZone() {
  return state.calibrationPlan.filter((item) => item.zoneId === getSelectedZoneId());
}

function renderMovementSelect({ force = false } = {}) {
  const familySelect = document.querySelector(selectors.calibrationFamily);
  if (!familySelect) return;
  const previousValue = familySelect.value;
  const options = getMovementOptionsForSelectedZone();
  familySelect.innerHTML = options.map((item) => `<option value="${item.familyId}">${item.movementLabel}</option>`).join('');
  familySelect.value = !force && options.some((item) => item.familyId === previousValue) ? previousValue : options[0]?.familyId || 'horizontal_push';
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
  const selected = getSelectedMovement();
  if (!exerciseSelect || !selected) return;
  const previousValue = exerciseSelect.value;
  const exercises = [...new Set([selected.defaultTest, ...selected.alternatives, 'Autre exercice proche / machine équivalente'].filter(Boolean))];
  exerciseSelect.innerHTML = exercises.map((exercise) => `<option value="${exercise}">${exercise}</option>`).join('');
  exerciseSelect.value = !force && exercises.includes(previousValue) ? previousValue : selected.defaultTest;
}

function renderCalibrationSelectOptions({ force = false } = {}) {
  const selectedFamily = getSelectedMovement()?.familyId || 'horizontal_push';
  setSelectOptions(document.querySelector('#calibration-weight'), getWeightOptions(selectedFamily), getDefaultWeight(selectedFamily), (value) => `${formatNumber(value)} kg`, { preserve: !force });
  setSelectOptions(document.querySelector('#calibration-reps'), buildRange(1, 30, 1), 8, (value) => `${formatNumber(value)} reps`, { preserve: !force });
  setSelectOptions(document.querySelector('#calibration-rir'), buildRange(0, 5, 1), 2, (value) => `${formatNumber(value)} RIR`, { preserve: !force });
  setSelectOptions(document.querySelector('#calibration-pain'), buildRange(0, 10, 1), 0, (value) => `${formatNumber(value)}/10`, { preserve: !force });
}

function getWeightOptions(familyId) {
  if (familyId === 'leg_press_pattern') return buildRange(20, 300, 5);
  if (familyId === 'calf_raise') return buildRange(10, 220, 5);
  if (familyId === 'shoulder_abduction') return buildRange(2.5, 60, 2.5);
  if (['elbow_flexion', 'elbow_extension', 'knee_extension', 'knee_flexion'].includes(familyId)) return buildRange(2.5, 100, 2.5);
  if (familyId === 'vertical_push') return buildRange(5, 140, 2.5);
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
  for (let value = min; value <= max + 0.0001; value += step) values.push(Number(value.toFixed(2)));
  return values;
}

function setSelectOptions(select, values, defaultValue, formatter = formatNumber, options = {}) {
  if (!select) return;
  const previousValue = select.value;
  const stringValues = values.map((value) => String(value));
  select.innerHTML = values.map((value) => `<option value="${value}" ${String(value) === String(defaultValue) ? 'selected' : ''}>${formatter(value)}</option>`).join('');
  if (options.preserve && stringValues.includes(previousValue)) select.value = previousValue;
  else if (stringValues.includes(String(defaultValue))) select.value = String(defaultValue);
}

function buildOptions(values, selectedValue, formatter = formatNumber) {
  return values.map((value) => `<option value="${value}" ${String(value) === String(selectedValue) ? 'selected' : ''}>${formatter(value)}</option>`).join('');
}

function buildExerciseOptions(item, selectedExercise) {
  const exercises = [...new Set([item.defaultTest, ...item.alternatives, 'Autre exercice proche / machine équivalente'].filter(Boolean))];
  return exercises.map((exercise) => `<option value="${exercise}" ${exercise === selectedExercise ? 'selected' : ''}>${exercise}</option>`).join('');
}

function formatNumber(value) {
  return Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

function getCalibrationEntries(familyId) {
  return state.calibrations.filter((entry) => entry.familyId === familyId);
}

function hasCalibration(familyId) {
  return getCalibrationEntries(familyId).length > 0;
}

function getLoadInputInfo(exerciseName, familyId) {
  const profile = getExerciseProfileByName(exerciseName, familyId);
  return getExerciseLoadInput(profile?.id);
}

function renderCalibrationGuidance(profile = getProfileFromForm()) {
  const container = document.querySelector(selectors.calibrationGuidance);
  if (!container) return;
  const requiredCoverage = summarizeCalibrationCoverage(profile, state.calibrations);
  const requiredFamilyIds = new Set(requiredCoverage.required.map((item) => item.familyId));
  const dashboardProfile = { ...profile, level: 'very_advanced' };
  const dashboardPlan = buildCalibrationPlan(dashboardProfile);
  const dashboardZones = buildCalibrationZones(dashboardProfile);
  const planByFamily = Object.fromEntries(dashboardPlan.map((item) => [item.familyId, item]));
  const completedDashboard = dashboardPlan.filter((item) => hasCalibration(item.familyId)).length;
  const testCount = state.calibrations.length;
  const dashboardScore = dashboardPlan.length ? Math.round((completedDashboard / dashboardPlan.length) * 100) : 0;
  const minimumLine = requiredCoverage.total === dashboardPlan.length
    ? `${completedDashboard}/${dashboardPlan.length} familles calibrées · ${testCount} test(s) précis.`
    : `Minimum pour ton niveau : ${requiredCoverage.completed}/${requiredCoverage.total}. Tous les groupes avancés : ${completedDashboard}/${dashboardPlan.length}. Tests précis : ${testCount}.`;

  container.innerHTML = `
    <article class="mini-card calibration-dashboard">
      <div><strong>Tableau de calibration</strong><span>${minimumLine} Plus tu ajoutes de variantes dans une même famille, plus le moteur choisit une source proche.</span></div>
      <div class="calibration-progress-row"><strong>${dashboardScore}%</strong><div class="calibration-progress"><span style="width: ${dashboardScore}%"></span></div></div>
    </article>
    <div class="calibration-zone-funnel">
      ${dashboardZones.map((zone) => {
        const doneCount = zone.availableFamilyIds.filter(hasCalibration).length;
        const zoneScore = zone.availableFamilyIds.length ? Math.round((doneCount / zone.availableFamilyIds.length) * 100) : 0;
        return `
          <details class="calibration-zone-accordion">
            <summary><strong>${zone.label}</strong><small>${doneCount}/${zone.availableFamilyIds.length} · ${zoneScore}%</small></summary>
            <div class="calibration-zone-content">
              <p class="muted">${zone.description}</p>
              <div class="calibration-zone-mini-progress"><span style="width: ${zoneScore}%"></span></div>
              <div class="calibration-movement-list">
                ${zone.availableFamilyIds.map((familyId) => renderInlineCalibrationCard({ zone, item: planByFamily[familyId], isMinimum: requiredFamilyIds.has(familyId) })).join('')}
              </div>
            </div>
          </details>`;
      }).join('')}
    </div>`;
}

function renderInlineCalibrationCard({ zone, item, isMinimum }) {
  const entries = getCalibrationEntries(item.familyId);
  const firstEntry = entries[0];
  const selectedExercise = firstEntry?.exerciseName || item.defaultTest;
  const selectedWeight = firstEntry?.enteredWeight || firstEntry?.inputWeight || getDefaultWeight(item.familyId);
  const selectedReps = firstEntry?.inputReps || 8;
  const selectedRir = firstEntry?.rir ?? 2;
  const selectedPain = firstEntry?.pain || 0;
  const selectedTechnique = firstEntry?.technique || 'clean';
  const loadInput = getLoadInputInfo(selectedExercise, item.familyId);
  const savedList = entries.length ? `<div class="saved-variants">${entries.map((entry) => `<small>✓ ${entry.exerciseName} · ${entry.enteredWeight ?? entry.inputWeight} ${entry.loadInputLabel || 'kg'} · confiance ${entry.confidence.label} (${entry.confidence.score}%)</small>`).join('')}</div>` : '';

  return `
    <details class="calibration-movement-roll ${entries.length ? 'is-complete' : ''}" data-calibration-inline="true" data-family-id="${item.familyId}" data-zone-id="${zone.id}">
      <summary><span><strong>${entries.length ? '✓ ' : ''}${item.movementLabel}</strong><small>${isMinimum ? 'minimum pour ton niveau' : 'complément avancé'}</small></span><small>${entries.length ? `${entries.length} test(s)` : 'à remplir'}</small></summary>
      <div class="calibration-movement-item ${entries.length ? 'is-complete' : ''}">
        <span>${item.instruction}</span>
        <small>Tu peux enregistrer plusieurs variantes : ${item.defaultTest}, ${item.alternatives.join(', ')}</small>
        ${savedList}
        <div class="inline-calibration-grid">
          <label>Exercice<select name="inlineExercise">${buildExerciseOptions(item, selectedExercise)}</select></label>
          <label>Charge — ${loadInput.label}<select name="inlineWeight">${buildOptions(getWeightOptions(item.familyId), selectedWeight, (value) => `${formatNumber(value)} kg`)}</select><small>${loadInput.note}</small></label>
          <label>Reps<select name="inlineReps">${buildOptions(buildRange(1, 30, 1), selectedReps, (value) => `${formatNumber(value)} reps`)}</select></label>
          <label>RIR<select name="inlineRir">${buildOptions(buildRange(0, 5, 1), selectedRir, (value) => `${formatNumber(value)}`)}</select></label>
          <label>Douleur<select name="inlinePain">${buildOptions(buildRange(0, 10, 1), selectedPain, (value) => `${formatNumber(value)}/10`)}</select></label>
          <label>Technique<select name="inlineTechnique"><option value="clean" ${selectedTechnique === 'clean' ? 'selected' : ''}>Propre</option><option value="unstable" ${selectedTechnique === 'unstable' ? 'selected' : ''}>Instable</option><option value="failed" ${selectedTechnique === 'failed' ? 'selected' : ''}>Trop lourd</option></select></label>
        </div>
        <button class="btn primary mini-action" type="button" data-save-inline-calibration="true">Enregistrer / mettre à jour cette variante</button>
      </div>
    </details>`;
}

function upsertCalibrationEntry(entry) {
  const key = entry.sourceProfileId || entry.exerciseName;
  state.calibrations = state.calibrations.filter((item) => !(item.familyId === entry.familyId && (item.sourceProfileId || item.exerciseName) === key));
  state.calibrations.push(entry);
}

function saveInlineCalibration(card) {
  if (!card) return;
  try {
    const entry = calculateCalibrationEntry({
      familyId: card.dataset.familyId,
      exerciseName: card.querySelector('[name="inlineExercise"]')?.value,
      weight: card.querySelector('[name="inlineWeight"]')?.value,
      reps: card.querySelector('[name="inlineReps"]')?.value,
      rir: card.querySelector('[name="inlineRir"]')?.value,
      pain: card.querySelector('[name="inlinePain"]')?.value,
      technique: card.querySelector('[name="inlineTechnique"]')?.value
    });
    upsertCalibrationEntry(entry);
    renderCalibrationList();
    refreshCalibrationPlan();
    saveDraft({ hasSavedPlan: false });
    updateSavedPlanControls();
    renderNotice(`Test enregistré : ${entry.zoneLabel} — ${entry.exerciseName}.`, 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function handleCalibrationSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const entry = calculateCalibrationEntry({ familyId: form.get('familyId'), exerciseName: form.get('calibrationExercise'), weight: form.get('calibrationWeight'), reps: form.get('calibrationReps'), rir: form.get('calibrationRir'), pain: form.get('calibrationPain'), technique: form.get('calibrationTechnique') });
    upsertCalibrationEntry(entry);
    renderCalibrationList();
    refreshCalibrationPlan();
    saveDraft({ hasSavedPlan: false });
    updateSavedPlanControls();
    renderNotice(`Calibration ajoutée : ${entry.zoneLabel} — ${entry.exerciseName}, confiance ${entry.confidence.label}.`, 'success');
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
    <article class="mini-card"><strong>${entry.zoneLabel} — ${entry.movementLabel} — ${entry.exerciseName}</strong><span>${entry.enteredWeight ?? entry.inputWeight} ${entry.loadInputLabel || 'kg'} × ${entry.inputReps} reps + RIR ${entry.rir}</span><span>Charge interne ${entry.sourceLoadKg || entry.inputWeight} kg · e1RM ≈ ${entry.estimatedOneRm} kg · confiance ${entry.confidence.label} (${entry.confidence.score}%)</span><span>Plage 8-12 reps : ${entry.workingRange.low}-${entry.workingRange.high} kg</span><small>${entry.loadInputNote || ''}</small><small>${entry.recommendation}</small></article>`).join('');
}

function handleGeneratePlan(event) {
  event?.preventDefault?.();
  const profile = getProfileFromForm();
  try {
    const plan = generateTrainingPlan({ profile, strengthTests: [], calibrations: state.calibrations });
    const nutrition = calculateNutritionTargets(profile);
    const menu = buildBudgetMenu(nutrition);
    state.hasSavedPlan = true;
    renderPlan(plan, nutrition, menu, profile);
    renderNotice('Programme généré et sauvegardé sur cet appareil.', 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function renderPlan(plan, nutrition, menu, profile) {
  const result = document.querySelector(selectors.result);
  if (!result) return;
  state.currentPlan = plan;
  state.currentNutrition = nutrition;
  state.currentMenu = menu;
  state.currentProfile = profile;
  state.hasSavedPlan = true;
  const coverage = summarizeCalibrationCoverage(profile, state.calibrations);
  result.classList.remove('empty');
  result.classList.add('result-generated-compact');
  const safetyContent = `<div class="alert ${plan.safety.flags.length ? 'alert-warning' : 'alert-neutral'}"><strong>${plan.safety.flags.length ? 'Prudence' : 'Sécurité'}</strong><p>${plan.safety.message}</p></div>`;
  const reliabilityContent = `<div class="metric-grid"><div class="metric"><strong>${coverage.score}%</strong><span>couverture familles</span></div><div class="metric"><strong>${coverage.completed}/${coverage.total}</strong><span>familles calibrées</span></div><div class="metric"><strong>${state.calibrations.length}</strong><span>tests précis</span></div><div class="metric"><strong>meilleur test</strong><span>choisi par similarité</span></div></div><p class="muted">${coverage.message}</p>`;
  const todayContent = renderTodaySession(plan);
  const trainingContent = `<div class="sessions-grid">${plan.sessions.map(renderSession).join('')}</div>`;
  const progressionContent = `<ul class="clean-list"><li><strong>Méthode :</strong> ${plan.progression.method}</li><li>${plan.progression.rule}</li><li><strong>Haut du corps :</strong> ${plan.progression.upperBody}</li><li><strong>Bas du corps :</strong> ${plan.progression.lowerBody}</li><li><strong>Deload :</strong> ${plan.progression.deload}</li><li>${plan.progression.goalNote}</li></ul>`;
  const nutritionContent = `<ul class="clean-list"><li><strong>BMR utilisé :</strong> ${nutrition.bmr} kcal/jour</li><li><strong>Maintenance :</strong> ${nutrition.maintenance} kcal/jour</li><li><strong>Cible :</strong> ${nutrition.calories.min}-${nutrition.calories.max} kcal/jour</li><li><strong>Protéines :</strong> ${nutrition.protein.min}-${nutrition.protein.max} g/jour</li><li>${nutrition.calories.note}</li></ul>`;
  const menuContent = `<h4>${menu.title}</h4><p><strong>Budget indicatif :</strong> ${menu.budget}</p><p class="muted">${menu.note}</p><div class="food-grid">${menu.staples.map((food) => `<article class="food-card"><strong>${food.name}</strong><span>${food.role}</span><small>${food.protein}</small></article>`).join('')}</div><h4>Journée type</h4><ol class="clean-list ordered">${menu.dayTemplate.map((item) => `<li>${item}</li>`).join('')}</ol><p>${menu.proteinTargetText}</p>`;
  result.innerHTML = `<div class="result-header"><p class="eyebrow">Programme généré</p><h2>${plan.title}</h2><p>${plan.intensity.cardio}</p><div class="saved-state-pill">Sauvegardé sur cet appareil · reprenable sans compte</div></div><div class="accordion-stack">${renderAccordion({ title: 'Séance du jour', badge: `${getCurrentSessionNumber(plan)}/${plan.sessions.length}`, content: todayContent, open: true })}${renderAccordion({ title: 'Sécurité', badge: plan.safety.flags.length ? 'prudence' : 'ok', content: safetyContent, open: true })}${renderAccordion({ title: 'Fiabilité des charges', badge: `${coverage.score}%`, content: reliabilityContent, open: true })}${renderCalculations(plan.calculations)}${renderAccordion({ title: 'Entraînement complet', badge: `${plan.sessions.length} séances`, content: trainingContent })}${renderAccordion({ title: 'Progression', badge: plan.progression.method, content: progressionContent })}${renderAccordion({ title: 'Diète / calories', badge: `${nutrition.calories.min}-${nutrition.calories.max} kcal`, content: nutritionContent })}${renderAccordion({ title: 'Menu budget / journée type', badge: menu.budget, content: menuContent })}</div>`;
  saveDraft({ hasSavedPlan: true });
  updateSavedPlanControls();
}

function renderAccordion({ title, badge = '', content, open = false }) {
  return `<details class="accordion-section" ${open ? 'open' : ''}><summary class="accordion-summary"><span>${title}</span>${badge ? `<small>${badge}</small>` : ''}</summary><div class="accordion-content">${content}</div></details>`;
}

function renderCalculations(calculations) {
  if (!calculations) return '';
  const content = `<div class="metric-grid"><div class="metric"><strong>${calculations.totalValidSets}</strong><span>séries valides/semaine</span></div><div class="metric"><strong>${calculations.totalPrepSets}</strong><span>séries préparation</span></div><div class="metric"><strong>${calculations.cardioMinutes} min</strong><span>cardio/semaine</span></div><div class="metric"><strong>${Object.keys(calculations.byMuscle || {}).length}</strong><span>groupes suivis</span></div></div><p class="muted">${calculations.densityNote}</p>${calculations.missingSessionNote ? `<p class="muted">${calculations.missingSessionNote}</p>` : ''}${renderMuscleVolume(calculations.byMuscle)}`;
  return renderAccordion({ title: calculations.title, badge: `${calculations.totalValidSets} séries`, content });
}

function renderMuscleVolume(byMuscle = {}) {
  const rows = Object.entries(byMuscle).sort((a, b) => b[1] - a[1]).map(([muscle, sets]) => `<li><strong>${muscle}</strong><span>${sets} séries valides</span></li>`).join('');
  return rows ? `<ul class="volume-list">${rows}</ul>` : '';
}

function renderSession(session) {
  const exercises = session.exercises.map((exercise) => `<div class="exercise-row"><div><strong>${exercise.name}</strong><span>${exercise.muscles.join(', ')}</span><small>${exercise.supportLabel || 'Préparation'} : ${exercise.alternative}</small>${exercise.note ? `<small>${exercise.note}</small>` : ''}</div><div class="exercise-dose"><strong>${exercise.sets}×${exercise.repRange[0]}-${exercise.repRange[1]}</strong><span>${exercise.loadText}</span><small>${exercise.rest}</small></div></div>`).join('');
  const content = `<p class="muted">${session.warmup}</p>${session.calculations ? `<p class="muted">Calcul séance : ${session.calculations.validSets} séries valides · ${session.calculations.prepSets} préparatoires · ${session.calculations.cardioMinutes} min cardio.</p>` : ''}<div class="exercise-list">${exercises}</div><p class="muted">${session.cooldown}</p>`;
  return renderAccordion({ title: session.title, badge: `${session.exercises.length} exercices`, content });
}

function renderTodaySession(plan) {
  const sessionIndex = getCurrentSessionIndex(plan);
  const session = plan.sessions[sessionIndex];
  if (!session) return '<p class="muted">Aucune séance disponible.</p>';
  const doneCount = session.exercises.filter((exercise, index) => getExerciseLog(session, exercise, index).done).length;
  return `
    <div class="today-workout" data-session-index="${sessionIndex}">
      <div class="today-workout-header">
        <div><p class="eyebrow">À faire maintenant</p><h3>${session.title}</h3><p class="muted">${doneCount}/${session.exercises.length} exercice(s) cochés. Les retours ajustent ta prochaine lecture du plan.</p></div>
        <div class="today-nav"><button class="btn ghost mini-action" type="button" data-session-shift="-1">Précédente</button><button class="btn ghost mini-action" type="button" data-session-shift="1">Suivante</button></div>
      </div>
      <div class="today-exercise-list">
        ${session.exercises.map((exercise, index) => renderTodayExercise(session, exercise, index)).join('')}
      </div>
    </div>`;
}

function renderTodayExercise(session, exercise, index) {
  const log = getExerciseLog(session, exercise, index);
  const key = getExerciseLogKey(session, exercise, index);
  return `
    <article class="today-exercise ${log.done ? 'is-done' : ''}" data-log-key="${key}">
      <label class="today-check"><input type="checkbox" data-exercise-done="${key}" ${log.done ? 'checked' : ''} /><span><strong>${exercise.name}</strong><small>${exercise.sets}×${exercise.repRange[0]}-${exercise.repRange[1]} · ${exercise.loadText}</small></span></label>
      <div class="feedback-row" aria-label="Retour exercice ${exercise.name}">
        ${['facile', 'correct', 'lourd', 'douleur'].map((feedback) => `<button class="feedback-chip ${log.feedback === feedback ? 'is-active' : ''}" type="button" data-exercise-feedback="${key}" data-feedback="${feedback}">${feedbackLabel(feedback)}</button>`).join('')}
      </div>
      ${log.feedback ? `<p class="feedback-advice">${feedbackAdvice(log.feedback)}</p>` : ''}
    </article>`;
}

function feedbackLabel(feedback) {
  return ({ facile: 'Trop facile', correct: 'Correct', lourd: 'Trop lourd', douleur: 'Douleur' })[feedback] || feedback;
}

function feedbackAdvice(feedback) {
  return ({
    facile: 'Prochaine séance : vise le haut de la plage ou augmente légèrement si la technique reste propre.',
    correct: 'Garde cette charge. La progression se fait quand toutes les séries sont propres.',
    lourd: 'Réduis légèrement ou garde la charge jusqu’à retrouver le RIR prévu.',
    douleur: 'Stoppe la progression sur ce mouvement et remplace-le si la douleur revient.'
  })[feedback] || '';
}

function handleResultInteraction(event) {
  const shiftButton = event.target.closest('[data-session-shift]');
  if (shiftButton && state.currentPlan) {
    state.sessionIndex = getCurrentSessionIndex(state.currentPlan) + Number(shiftButton.dataset.sessionShift || 0);
    renderPlan(state.currentPlan, state.currentNutrition, state.currentMenu, state.currentProfile);
    return;
  }

  const feedbackButton = event.target.closest('[data-exercise-feedback]');
  if (feedbackButton && state.currentPlan) {
    const key = feedbackButton.dataset.exerciseFeedback;
    state.workoutLog[key] = { ...state.workoutLog[key], feedback: feedbackButton.dataset.feedback };
    renderPlan(state.currentPlan, state.currentNutrition, state.currentMenu, state.currentProfile);
  }
}

function handleResultChange(event) {
  const checkbox = event.target.closest('[data-exercise-done]');
  if (!checkbox || !state.currentPlan) return;
  const key = checkbox.dataset.exerciseDone;
  state.workoutLog[key] = { ...state.workoutLog[key], done: checkbox.checked };
  renderPlan(state.currentPlan, state.currentNutrition, state.currentMenu, state.currentProfile);
}

function getCurrentSessionIndex(plan) {
  if (!plan.sessions.length) return 0;
  return ((state.sessionIndex % plan.sessions.length) + plan.sessions.length) % plan.sessions.length;
}

function getCurrentSessionNumber(plan) {
  return getCurrentSessionIndex(plan) + 1;
}

function getExerciseLog(session, exercise, index) {
  return state.workoutLog[getExerciseLogKey(session, exercise, index)] || {};
}

function getExerciseLogKey(session, exercise, index) {
  return `${session.title}::${index}::${exercise.name}`;
}

function renderEmptyState() {
  const result = document.querySelector(selectors.result);
  if (!result) return;
  result.classList.add('empty');
  result.classList.remove('result-generated-compact');
  result.innerHTML = '<p class="eyebrow">Résultat</p><h2>Remplis les étapes puis génère le programme final.</h2><p>Les mouvements calibrés auront une plage de charge. Les mouvements non calibrés resteront prescrits avec une logique RIR 1-3.</p>';
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
  syncDerivedProfileFields();
  refreshCalibrationPlan();
  hydrateCalibrationFieldsFromSelection({ force: true });
  state.calibrations = [
    calculateCalibrationEntry({ familyId: 'horizontal_push', exerciseName: 'Développé couché', weight: 80, reps: 8, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'horizontal_push', exerciseName: 'Développé incliné haltères', weight: 30, reps: 10, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'pec_isolation', exerciseName: 'Pec deck', weight: 55, reps: 12, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'leg_press_pattern', exerciseName: 'Leg press 45°', weight: 180, reps: 8, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'vertical_push', exerciseName: 'Développé assis', weight: 45, reps: 8, rir: 2, pain: 0, technique: 'clean' })
  ];
  state.hasSavedPlan = false;
  renderCalibrationList();
  renderCalibrationGuidance(getProfileFromForm());
  saveDraft({ hasSavedPlan: false });
  updateSavedPlanControls();
  renderNotice('Démo très avancée chargée avec plusieurs variantes de calibration.', 'success');
}

function getProfileValues() {
  const form = document.querySelector(selectors.profileForm);
  if (!form) return {};
  syncDerivedProfileFields();
  return Object.fromEntries(new FormData(form).entries());
}

function applyProfileValues(values = {}) {
  const form = document.querySelector(selectors.profileForm);
  if (!form) return;
  Object.entries(values).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field || value === undefined || value === null) return;
    field.value = value;
  });
  syncDerivedProfileFields();
}

function readSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveDraft(options = {}) {
  try {
    const saved = readSavedState() || {};
    const hasSavedPlan = options.hasSavedPlan ?? state.hasSavedPlan ?? saved.hasSavedPlan ?? false;
    const payload = {
      ...saved,
      profile: getProfileValues(),
      calibrations: state.calibrations,
      workoutLog: state.workoutLog,
      sessionIndex: state.sessionIndex,
      uxMode: state.uxMode,
      hasSavedPlan,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    state.hasSavedPlan = hasSavedPlan;
  } catch {
    // localStorage can be disabled in private modes; the app remains usable without persistence.
  }
}

function restoreSavedState() {
  const saved = readSavedState();
  if (!saved) return;
  applyProfileValues(saved.profile || {});
  state.calibrations = Array.isArray(saved.calibrations) ? saved.calibrations : [];
  state.workoutLog = saved.workoutLog || {};
  state.sessionIndex = Number(saved.sessionIndex || 0);
  state.uxMode = saved.uxMode || 'advanced';
  state.hasSavedPlan = Boolean(saved.hasSavedPlan);
}

function regenerateSavedPlan({ silent = false } = {}) {
  const saved = readSavedState();
  if (saved?.profile) applyProfileValues(saved.profile);
  if (Array.isArray(saved?.calibrations)) state.calibrations = saved.calibrations;
  state.workoutLog = saved?.workoutLog || state.workoutLog || {};
  state.sessionIndex = Number(saved?.sessionIndex || state.sessionIndex || 0);
  refreshCalibrationPlan();
  hydrateCalibrationFieldsFromSelection({ force: true });
  renderCalibrationList();
  const profile = getProfileFromForm();
  try {
    const plan = generateTrainingPlan({ profile, strengthTests: [], calibrations: state.calibrations });
    const nutrition = calculateNutritionTargets(profile);
    const menu = buildBudgetMenu(nutrition);
    state.hasSavedPlan = true;
    renderPlan(plan, nutrition, menu, profile);
    if (!silent) renderNotice('Dernier plan repris depuis cet appareil.', 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function clearSavedPlan() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  state.hasSavedPlan = false;
  state.currentPlan = null;
  state.currentNutrition = null;
  state.currentMenu = null;
  state.currentProfile = null;
  state.sessionIndex = 0;
  state.workoutLog = {};
  updateSavedPlanControls();
  renderEmptyState();
  renderNotice('Sauvegarde locale supprimée.', 'success');
}

function updateSavedPlanControls() {
  const saved = readSavedState();
  const hasPlan = Boolean(saved?.hasSavedPlan);
  document.querySelector('#resume-plan')?.toggleAttribute('hidden', !hasPlan);
  document.querySelector('#clear-saved-plan')?.toggleAttribute('hidden', !saved);
}

function applyUxMode(mode = 'advanced') {
  state.uxMode = mode === 'quick' ? 'quick' : 'advanced';
  document.body.classList.toggle('ux-mode-quick', state.uxMode === 'quick');
  document.querySelectorAll('[data-set-mode]').forEach((button) => button.classList.toggle('is-active', button.dataset.setMode === state.uxMode));
  renderNotice(state.uxMode === 'quick' ? 'Mode rapide actif : tu peux générer sans remplir les tests avancés.' : 'Mode avancé actif : calibrations et détails complets visibles.', 'neutral');
}

init();
