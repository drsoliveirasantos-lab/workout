const pickerConfig = {
  age: { unit: 'ans', aria: 'âge' },
  heightCm: { unit: 'cm', aria: 'taille' },
  weightKg: { unit: 'kg', aria: 'poids' }
};

const visualChoiceMeta = {
  sex: {
    className: 'sex-segment-group',
    items: {
      male: { code: 'H', label: 'Homme', hint: 'BMR masculin' },
      female: { code: 'F', label: 'Femme', hint: 'BMR féminin' }
    }
  },
  physicalProfile: {
    className: 'physique-chip-group',
    items: {
      unknown: { code: 'STD', label: 'Standard', hint: 'Neutre' },
      lean_low_muscle: { code: 'SLM', label: 'Mince peu musclé', hint: 'Progressif' },
      lean_athletic: { code: 'ATH', label: 'Mince sportif', hint: 'Actif' },
      standard: { code: 'BAL', label: 'Standard', hint: 'Équilibré' },
      muscular_lean: { code: 'DRY', label: 'Musclé sec', hint: 'Dense' },
      muscular_soft: { code: 'STR', label: 'Musclé + gras', hint: 'Force' },
      overweight_low_muscle: { code: 'CUT', label: 'Surpoids peu musclé', hint: 'Technique' },
      overweight_muscular: { code: 'PWR', label: 'Surpoids musclé', hint: 'Puissance' }
    }
  }
};

function initVisualPickers() {
  injectVisualPickerStyles();
  enhanceNumberSteppers();
  enhanceVisualChoices();
  bindDemoRefresh();
}

function injectVisualPickerStyles() {
  if (document.querySelector('link[data-visual-pickers]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'src/visual-pickers.css?v=20260703-picker2';
  link.dataset.visualPickers = 'true';
  document.head.appendChild(link);
}

function enhanceNumberSteppers(root = document) {
  Object.keys(pickerConfig).forEach((name) => {
    const select = root.querySelector(`select[name="${name}"]`);
    if (!select || select.dataset.stepperEnhanced === 'true') return;
    select.dataset.stepperEnhanced = 'true';
    select.classList.add('visual-picker-native');
    const stepper = document.createElement('div');
    stepper.className = 'number-stepper';
    stepper.dataset.stepperFor = name;
    stepper.innerHTML = `
      <button class="number-stepper-btn" type="button" data-stepper-step="-1" aria-label="Diminuer ${pickerConfig[name].aria}">−</button>
      <button class="number-stepper-display" type="button" aria-label="Changer ${pickerConfig[name].aria}"></button>
      <button class="number-stepper-btn" type="button" data-stepper-step="1" aria-label="Augmenter ${pickerConfig[name].aria}">+</button>`;
    select.insertAdjacentElement('afterend', stepper);

    stepper.addEventListener('click', (event) => {
      const stepButton = event.target.closest('[data-stepper-step]');
      if (stepButton) shiftSelect(select, Number(stepButton.dataset.stepperStep));
    });

    stepper.addEventListener('wheel', (event) => {
      event.preventDefault();
      shiftSelect(select, event.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    let startY = null;
    stepper.addEventListener('touchstart', (event) => { startY = event.touches[0]?.clientY ?? null; }, { passive: true });
    stepper.addEventListener('touchend', (event) => {
      if (startY === null) return;
      const endY = event.changedTouches[0]?.clientY ?? startY;
      const diff = startY - endY;
      if (Math.abs(diff) > 18) shiftSelect(select, diff > 0 ? 1 : -1);
      startY = null;
    });

    select.addEventListener('change', () => renderStepper(select));
    renderStepper(select);
  });
}

function renderStepper(select) {
  const stepper = select.nextElementSibling?.classList?.contains('number-stepper') ? select.nextElementSibling : null;
  if (!stepper) return;
  const display = stepper.querySelector('.number-stepper-display');
  const current = select.selectedOptions[0] || select.options[0];
  const config = pickerConfig[select.name] || {};
  const value = current?.textContent || `${select.value} ${config.unit || ''}`;
  const options = [...select.options];
  const currentIndex = Math.max(0, options.findIndex((option) => option.selected));
  const previous = options[Math.max(0, currentIndex - 1)]?.textContent || '';
  const next = options[Math.min(options.length - 1, currentIndex + 1)]?.textContent || '';
  display.innerHTML = `<span>${escapeHtml(previous)}</span><strong>${escapeHtml(value)}</strong><span>${escapeHtml(next)}</span>`;
}

function shiftSelect(select, delta) {
  const options = [...select.options];
  const currentIndex = Math.max(0, options.findIndex((option) => option.selected));
  const nextIndex = Math.min(options.length - 1, Math.max(0, currentIndex + delta));
  setSelectValue(select, options[nextIndex].value);
}

function setSelectValue(select, value) {
  if (select.value === value) return;
  select.value = value;
  select.dispatchEvent(new Event('input', { bubbles: true }));
  select.dispatchEvent(new Event('change', { bubbles: true }));
  renderStepper(select);
  syncVisualChoiceGroup(select);
}

function enhanceVisualChoices(root = document) {
  Object.entries(visualChoiceMeta).forEach(([name, config]) => {
    const select = root.querySelector(`select[name="${name}"]`);
    if (!select || select.dataset.choiceEnhanced === 'true') return;
    select.dataset.choiceEnhanced = 'true';
    select.classList.add('visual-picker-native');
    const group = document.createElement('div');
    group.className = `visual-choice-group ${config.className}`;
    group.dataset.choiceFor = name;
    select.insertAdjacentElement('afterend', group);
    group.addEventListener('click', (event) => {
      const card = event.target.closest('[data-choice-value]');
      if (!card) return;
      setSelectValue(select, card.dataset.choiceValue);
    });
    select.addEventListener('change', () => syncVisualChoiceGroup(select));
    syncVisualChoiceGroup(select);
  });
}

function syncVisualChoiceGroup(select) {
  const group = select.nextElementSibling?.classList?.contains('visual-choice-group') ? select.nextElementSibling : null;
  if (!group) return;
  const meta = visualChoiceMeta[select.name];
  group.innerHTML = [...select.options].map((option) => {
    const item = meta.items[option.value] || { code: 'OPT', label: option.textContent, hint: '' };
    const selected = option.value === select.value;
    return `<button class="visual-choice-chip ${selected ? 'is-selected' : ''}" type="button" data-choice-value="${escapeAttr(option.value)}" aria-pressed="${selected ? 'true' : 'false'}">
      <span class="visual-choice-code">${escapeHtml(item.code)}</span>
      <span class="visual-choice-copy"><strong>${escapeHtml(item.label || option.textContent)}</strong><small>${escapeHtml(item.hint || option.textContent)}</small></span>
    </button>`;
  }).join('');
}

function bindDemoRefresh() {
  document.querySelector('#load-demo')?.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      enhanceNumberSteppers();
      enhanceVisualChoices();
      document.querySelectorAll('select').forEach((select) => {
        renderStepper(select);
        syncVisualChoiceGroup(select);
      });
    });
  });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVisualPickers);
} else {
  initVisualPickers();
}
