const lateralRaiseNames = ['elevation laterale halteres', 'elevation laterale assise avec haltere', 'lateral raise'];
const cableLateralNames = ['elevation laterale poulie', 'elevation laterale unilaterale avec cable', 'cable lateral raise'];
const customSelectLongNames = new Set(['age', 'heightCm', 'weightKg', 'calibrationWeight', 'calibrationReps', 'inlineWeight', 'inlineReps', 'sex', 'physicalProfile']);
const premiumControlIcons = {
  sex: '⚥',
  age: '◷',
  heightCm: '↕',
  weightKg: '◉',
  physicalProfile: '◌',
  bodyFatEstimate: '%',
  level: '◆',
  goal: '◎',
  daysPerWeek: '7',
  priorityMuscleUi: '✦',
  recoveryLevelUi: '↺',
  exercisePreferenceUi: '⌁',
  painZoneUi: '!',
  activity: '↯',
  budget: '€',
  equipment: '▣',
  injuriesText: '⚕',
  medicalFlagsText: '☤',
  zoneId: '◇',
  familyId: '↔',
  calibrationExercise: '🏋',
  calibrationWeight: 'kg',
  calibrationReps: '#',
  calibrationRir: 'R',
  calibrationPain: '!',
  calibrationTechnique: '✓',
  inlineExercise: '🏋',
  inlineWeight: 'kg',
  inlineReps: '#',
  inlineRir: 'R',
  inlinePain: '!',
  inlineTechnique: '✓'
};

function initUxPolish() {
  injectPremiumControlStyles();
  loadVisualPickers();
  decoratePremiumControls();
  addRecoveryHelp();
  bindManualWeightSelect();
  bindInlineCalibrationWeights();
  bindCustomSelectGlobalEvents();
  polishRenderedResults();
  observeResultChanges();
}

function injectPremiumControlStyles() {
  if (document.querySelector('link[data-premium-controls]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'src/premium-controls.css?v=20260703-select2';
  link.dataset.premiumControls = 'true';
  document.head.appendChild(link);
}

function loadVisualPickers() {
  if (document.querySelector('script[data-visual-pickers]')) return;
  const script = document.createElement('script');
  script.src = 'src/visual-pickers.js?v=20260703-picker4';
  script.dataset.visualPickers = 'true';
  script.defer = true;
  document.body.appendChild(script);
}

function decoratePremiumControls(root = document) {
  root.querySelectorAll('select, textarea, input:not([type="hidden"])').forEach((control) => {
    const label = control.closest('label');
    if (!label) return;

    if (label.dataset.premiumDecorated !== 'true') {
      label.classList.add('premium-control-field');
      label.dataset.premiumDecorated = 'true';
      label.dataset.controlIcon = premiumControlIcons[control.name] || '⌄';
      control.dataset.premiumControl = 'true';
    }

    if (control.matches('select')) enhanceCustomSelect(control);
  });
}

function shouldUseCustomSelect(select) {
  if (!select || select.dataset.rangeSelect !== undefined) return false;
  if (customSelectLongNames.has(select.name)) return false;
  if (select.options.length === 0 || select.options.length > 14) return false;
  return true;
}

function enhanceCustomSelect(select) {
  if (!shouldUseCustomSelect(select)) {
    removeCustomSelect(select);
    return;
  }

  let custom = select.nextElementSibling?.classList?.contains('custom-select') ? select.nextElementSibling : null;
  if (!custom) {
    custom = document.createElement('div');
    custom.className = 'custom-select';
    custom.innerHTML = '<button class="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false"></button><div class="custom-select-menu" role="listbox"></div>';
    select.insertAdjacentElement('afterend', custom);
    select.classList.add('custom-select-native');

    custom.querySelector('.custom-select-trigger').addEventListener('click', () => toggleCustomSelect(custom));
    custom.querySelector('.custom-select-menu').addEventListener('click', (event) => {
      const optionButton = event.target.closest('[data-custom-option]');
      if (!optionButton) return;
      select.value = optionButton.dataset.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      syncCustomSelect(select);
      closeCustomSelect(custom);
    });

    custom.querySelector('.custom-select-trigger').addEventListener('keydown', (event) => handleCustomSelectKeydown(event, select, custom));
    select.addEventListener('change', () => syncCustomSelect(select));
  }

  syncCustomSelect(select);
}

function removeCustomSelect(select) {
  select.classList.remove('custom-select-native');
  const custom = select.nextElementSibling?.classList?.contains('custom-select') ? select.nextElementSibling : null;
  if (custom) custom.remove();
}

function syncCustomSelect(select) {
  const custom = select.nextElementSibling?.classList?.contains('custom-select') ? select.nextElementSibling : null;
  if (!custom) return;
  const trigger = custom.querySelector('.custom-select-trigger');
  const menu = custom.querySelector('.custom-select-menu');
  const selectedOption = select.selectedOptions[0] || select.options[0];
  trigger.textContent = selectedOption?.textContent || 'Sélectionner';
  trigger.setAttribute('aria-label', `Sélection actuelle : ${trigger.textContent}`);
  menu.innerHTML = [...select.options].map((option) => `
    <button class="custom-select-option ${option.selected ? 'is-selected' : ''}" type="button" role="option" aria-selected="${option.selected ? 'true' : 'false'}" data-custom-option data-value="${escapeAttr(option.value)}">${escapeHtml(option.textContent)}</button>
  `).join('');
}

function toggleCustomSelect(custom) {
  const isOpen = custom.classList.contains('is-open');
  closeAllCustomSelects();
  if (!isOpen) openCustomSelect(custom);
}

function openCustomSelect(custom) {
  custom.classList.add('is-open');
  custom.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'true');
}

function closeCustomSelect(custom) {
  custom.classList.remove('is-open');
  custom.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
}

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select.is-open').forEach(closeCustomSelect);
}

function handleCustomSelectKeydown(event, select, custom) {
  if (event.key === 'Escape') {
    closeCustomSelect(custom);
    return;
  }

  if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  const options = [...select.options];
  if (!options.length) return;
  let index = options.findIndex((option) => option.selected);
  if (event.key === 'ArrowDown') index = Math.min(options.length - 1, index + 1);
  if (event.key === 'ArrowUp') index = Math.max(0, index - 1);
  if (event.key === 'Enter' || event.key === ' ') {
    toggleCustomSelect(custom);
    return;
  }
  select.value = options[index]?.value || select.value;
  select.dispatchEvent(new Event('input', { bubbles: true }));
  select.dispatchEvent(new Event('change', { bubbles: true }));
  syncCustomSelect(select);
}

function bindCustomSelectGlobalEvents() {
  if (document.body.dataset.customSelectEventsBound === 'true') return;
  document.body.dataset.customSelectEventsBound = 'true';
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.custom-select')) closeAllCustomSelects();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllCustomSelects();
  });
}

function addRecoveryHelp() {
  const select = document.querySelector('[name="recoveryLevelUi"]');
  const label = select?.closest('.field');
  if (!label || label.querySelector('.help-popover')) return;

  [...label.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Récupération')) node.remove();
  });

  const wrapper = document.createElement('span');
  wrapper.className = 'field-label-with-help';
  wrapper.innerHTML = `
    Récupération
    <details class="help-popover">
      <summary aria-label="Aide récupération">i</summary>
      <div class="help-content">
        <strong>À quoi ça sert ?</strong>
        <span>Ce réglage adapte le volume : moins de séries si sommeil/stress mauvais, un peu plus si récupération très bonne.</span>
        <strong>Conseil</strong>
        <span>Choisis “Normale” par défaut. Passe à “Faible” si fatigue, douleurs ou baisse de performance.</span>
      </div>
    </details>`;
  label.insertBefore(wrapper, select);
}

function bindManualWeightSelect() {
  const exercise = document.querySelector('#calibration-exercise');
  const family = document.querySelector('#calibration-family');
  if (!exercise || !family) return;

  const sync = () => rebuildWeightSelect({
    weightSelect: document.querySelector('#calibration-weight'),
    familyId: family.value,
    exerciseName: exercise.value,
    defaultValue: getDefaultWeight(family.value, exercise.value)
  });

  exercise.addEventListener('change', sync);
  family.addEventListener('change', () => setTimeout(sync, 0));
  sync();
}

function bindInlineCalibrationWeights() {
  const host = document.querySelector('#calibration-guidance');
  if (!host) return;

  host.addEventListener('change', (event) => {
    const exerciseSelect = event.target.closest('select[name="inlineExercise"]');
    if (!exerciseSelect) return;
    const card = exerciseSelect.closest('[data-calibration-inline]');
    if (!card) return;
    const familyId = card.dataset.familyId;
    rebuildWeightSelect({
      weightSelect: card.querySelector('select[name="inlineWeight"]'),
      familyId,
      exerciseName: exerciseSelect.value,
      defaultValue: getDefaultWeight(familyId, exerciseSelect.value)
    });
  });

  syncInlineWeightRanges();
}

function syncInlineWeightRanges() {
  document.querySelectorAll('[data-calibration-inline]').forEach((card) => {
    const exerciseSelect = card.querySelector('select[name="inlineExercise"]');
    const weightSelect = card.querySelector('select[name="inlineWeight"]');
    if (!exerciseSelect || !weightSelect) return;
    rebuildWeightSelect({
      weightSelect,
      familyId: card.dataset.familyId,
      exerciseName: exerciseSelect.value,
      defaultValue: getDefaultWeight(card.dataset.familyId, exerciseSelect.value)
    });
  });
}

function rebuildWeightSelect({ weightSelect, familyId, exerciseName, defaultValue }) {
  if (!weightSelect) return;
  const previous = Number(weightSelect.value);
  const options = getWeightOptions(familyId, exerciseName);
  const values = options.values;
  const stringValues = values.map((value) => String(value));
  const signature = `${familyId}|${normalize(exerciseName)}|${values.join(',')}`;

  if (weightSelect.dataset.weightRangeSignature === signature && stringValues.includes(weightSelect.value)) return;

  const nextValue = Number.isFinite(previous) && previous >= values[0] && previous <= values[values.length - 1]
    ? previous
    : defaultValue;
  weightSelect.innerHTML = values.map((value) => `<option value="${value}" ${value === nextValue ? 'selected' : ''}>${formatNumber(value)} kg</option>`).join('');
  weightSelect.dataset.weightRangeSignature = signature;
  removeCustomSelect(weightSelect);
}

function getWeightOptions(familyId, exerciseName = '') {
  const name = normalize(exerciseName);

  if (lateralRaiseNames.some((token) => name.includes(token))) return { values: range(1, 25, 1), defaultValue: 8 };
  if (cableLateralNames.some((token) => name.includes(token))) return { values: range(1, 30, 1), defaultValue: 8 };
  if (familyId === 'shoulder_abduction') return { values: range(1, 25, 1), defaultValue: 8 };
  if (familyId === 'leg_press_pattern') return { values: range(20, 300, 5), defaultValue: 120 };
  if (familyId === 'calf_raise') return { values: range(5, 220, 5), defaultValue: 60 };
  if (familyId === 'vertical_push') return { values: range(2.5, 140, 2.5), defaultValue: 30 };
  if (['elbow_flexion', 'elbow_extension'].includes(familyId)) return { values: range(1, 80, 1), defaultValue: 15 };
  if (['knee_extension', 'knee_flexion'].includes(familyId)) return { values: range(5, 120, 2.5), defaultValue: 25 };
  if (familyId === 'pec_isolation') return { values: range(2.5, 120, 2.5), defaultValue: 25 };
  if (familyId === 'hip_extension') return { values: range(10, 240, 5), defaultValue: 80 };
  return { values: range(5, 220, 2.5), defaultValue: 60 };
}

function getDefaultWeight(familyId, exerciseName = '') {
  return getWeightOptions(familyId, exerciseName).defaultValue;
}

function polishRenderedResults() {
  decoratePremiumControls();
  compactGeneratedResult();
  replaceReliabilityVocabulary();
  addReliabilityHelp();
  renameSessionAccordions();
  compactSessionNotes();
  compactExerciseDetails();
  syncInlineWeightRanges();
}

function compactGeneratedResult() {
  const result = document.querySelector('#result');
  if (!result || result.classList.contains('empty')) return;
  result.classList.add('result-generated-compact');

  const sections = [...result.querySelectorAll('.accordion-stack > .accordion-section')];
  sections.forEach((section) => {
    const title = section.querySelector('.accordion-summary span')?.textContent.trim() || '';
    const shouldCollapseByDefault = ['Sécurité', 'Fiabilité des charges'].includes(title);
    if (shouldCollapseByDefault && !section.dataset.autoCollapsed) {
      section.open = false;
      section.dataset.autoCollapsed = 'true';
    }
  });
}

function replaceReliabilityVocabulary() {
  document.querySelectorAll('.metric span, .calibration-dashboard span, .calibration-zone-accordion summary small').forEach((node) => {
    node.textContent = node.textContent
      .replace(/couverture familles/gi, 'mouvements calibrés')
      .replace(/familles calibrées/gi, 'mouvements calibrés')
      .replace(/famille/gi, 'type de mouvement');
  });
}

function addReliabilityHelp() {
  const sections = [...document.querySelectorAll('.accordion-section')];
  const reliability = sections.find((section) => section.querySelector('.accordion-summary span')?.textContent.includes('Fiabilité des charges'));
  const content = reliability?.querySelector('.accordion-content');
  if (!content || content.querySelector('.compact-help')) return;

  const help = document.createElement('details');
  help.className = 'compact-help';
  help.innerHTML = `
    <summary>Comment lire cette fiabilité ?</summary>
    <p>Elle indique combien de types de mouvements ont une charge réellement calibrée. Plus tu ajoutes de tests proches de tes exercices, plus les charges proposées sont fiables.</p>`;
  content.insertBefore(help, content.firstChild);
}

function renameSessionAccordions() {
  const summaries = [...document.querySelectorAll('.sessions-grid > .accordion-section > .accordion-summary span')];
  const map4 = ['Pecs · Épaules · Triceps', 'Dos · Biceps', 'Jambes · Fessiers', 'Haut du corps · Rappels'];
  const map5 = ['Pecs · Triceps', 'Dos · Biceps', 'Jambes · Quadriceps/Fessiers', 'Épaules · Bras', 'Chaîne postérieure'];
  const names = summaries.length >= 5 ? map5 : map4;

  summaries.forEach((summary, index) => {
    if (/Entraînement [A-E]/.test(summary.textContent) && names[index]) {
      summary.textContent = names[index];
    }
  });
}

function compactSessionNotes() {
  document.querySelectorAll('.sessions-grid .accordion-content:not([data-session-compact])').forEach((content) => {
    const paragraphs = [...content.children].filter((child) => child.matches('p.muted'));
    const exerciseList = content.querySelector('.exercise-list');
    if (!paragraphs.length || !exerciseList) return;

    const details = document.createElement('details');
    details.className = 'session-notes';
    details.innerHTML = '<summary>Échauffement / cardio / calculs</summary>';
    paragraphs.forEach((paragraph) => details.appendChild(paragraph));
    content.insertBefore(details, exerciseList);
    content.dataset.sessionCompact = 'true';
  });
}

function compactExerciseDetails() {
  document.querySelectorAll('.exercise-row:not([data-exercise-compact])').forEach((row) => {
    const info = row.firstElementChild;
    if (!info) return;
    const smalls = [...info.querySelectorAll(':scope > small')];
    if (!smalls.length) return;

    const details = document.createElement('details');
    details.className = 'exercise-details-compact';
    const body = document.createElement('div');
    body.className = 'details-body';
    details.innerHTML = '<summary>Détails</summary>';
    smalls.forEach((small) => body.appendChild(small));
    details.appendChild(body);
    info.appendChild(details);
    row.dataset.exerciseCompact = 'true';
  });
}

function observeResultChanges() {
  const result = document.querySelector('#result');
  const guidance = document.querySelector('#calibration-guidance');
  const observer = new MutationObserver(() => window.requestAnimationFrame(polishRenderedResults));
  if (result) observer.observe(result, { childList: true, subtree: true });
  if (guidance) observer.observe(guidance, { childList: true, subtree: true });
}

function range(min, max, step) {
  const values = [];
  for (let value = min; value <= max + 0.0001; value += step) values.push(Number(value.toFixed(2)));
  return values;
}

function formatNumber(value) {
  return Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUxPolish);
} else {
  initUxPolish();
}
