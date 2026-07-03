const pickerConfig = {
  age: { unit: 'ans', aria: 'âge' },
  heightCm: { unit: 'cm', aria: 'taille' },
  weightKg: { unit: 'kg', aria: 'poids' }
};

const visualChoiceMeta = {
  sex: {
    className: 'sex-dropdown',
    items: {
      male: { code: 'H', label: 'Homme', hint: 'BMR masculin' },
      female: { code: 'F', label: 'Femme', hint: 'BMR féminin' }
    }
  },
  physicalProfile: {
    className: 'physique-dropdown',
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
  enhanceVisualDropdowns();
  bindDemoRefresh();
  bindGlobalDropdownClose();
}

function injectVisualPickerStyles() {
  if (document.querySelector('link[data-visual-pickers]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'src/visual-pickers.css?v=20260703-picker4';
  link.dataset.visualPickers = 'true';
  document.head.appendChild(link);
}

function enhanceNumberSteppers(root = document) {
  Object.keys(pickerConfig).forEach((name) => {
    const select = root.querySelector(`select[name="${name}"]`);
    if (!select || select.dataset.stepperEnhanced === 'true') return;
    const field = select.closest('label');
    field?.classList.add('compact-number-control');
    field?.setAttribute('data-control-icon', '');
    select.dataset.stepperEnhanced = 'true';
    select.classList.add('visual-picker-native');
    const stepper = document.createElement('div');
    stepper.className = 'number-stepper number-stepper-compact';
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
  display.innerHTML = `<strong>${escapeHtml(value)}</strong>`;
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
  syncVisualDropdown(select);
}

function enhanceVisualDropdowns(root = document) {
  Object.entries(visualChoiceMeta).forEach(([name, config]) => {
    const select = root.querySelector(`select[name="${name}"]`);
    if (!select) return;
    removeNativeCustomSelect(select);
    if (select.dataset.choiceEnhanced === 'true') {
      syncVisualDropdown(select);
      return;
    }
    select.dataset.choiceEnhanced = 'true';
    select.classList.add('visual-picker-native');
    const dropdown = document.createElement('div');
    dropdown.className = `visual-choice-dropdown ${config.className}`;
    dropdown.dataset.choiceFor = name;
    dropdown.innerHTML = '<button class="visual-choice-trigger" type="button" aria-haspopup="listbox" aria-expanded="false"></button><div class="visual-choice-menu" role="listbox"></div>';
    select.insertAdjacentElement('afterend', dropdown);

    dropdown.querySelector('.visual-choice-trigger').addEventListener('click', () => toggleVisualDropdown(dropdown));
    dropdown.querySelector('.visual-choice-menu').addEventListener('click', (event) => {
      const option = event.target.closest('[data-choice-value]');
      if (!option) return;
      setSelectValue(select, option.dataset.choiceValue);
      closeVisualDropdown(dropdown);
    });
    select.addEventListener('change', () => syncVisualDropdown(select));
    syncVisualDropdown(select);
  });
}

function removeNativeCustomSelect(select) {
  const sibling = select.nextElementSibling;
  if (sibling?.classList?.contains('custom-select')) sibling.remove();
  select.classList.remove('custom-select-native');
}

function syncVisualDropdown(select) {
  const dropdown = select.nextElementSibling?.classList?.contains('visual-choice-dropdown') ? select.nextElementSibling : null;
  if (!dropdown) return;
  const meta = visualChoiceMeta[select.name];
  const trigger = dropdown.querySelector('.visual-choice-trigger');
  const menu = dropdown.querySelector('.visual-choice-menu');
  const selected = select.selectedOptions[0] || select.options[0];
  const selectedItem = meta.items[selected?.value] || { code: 'OPT', label: selected?.textContent || 'Sélectionner', hint: '' };

  trigger.innerHTML = renderChoiceContent(selectedItem, true);
  trigger.setAttribute('aria-label', `Sélection actuelle : ${selectedItem.label}`);
  menu.innerHTML = [...select.options].map((option) => {
    const item = meta.items[option.value] || { code: 'OPT', label: option.textContent, hint: '' };
    const isSelected = option.value === select.value;
    return `<button class="visual-choice-option ${isSelected ? 'is-selected' : ''}" type="button" role="option" aria-selected="${isSelected ? 'true' : 'false'}" data-choice-value="${escapeAttr(option.value)}">${renderChoiceContent(item, false)}</button>`;
  }).join('');
}

function renderChoiceContent(item, withChevron) {
  return `<span class="visual-choice-code">${escapeHtml(item.code)}</span><span class="visual-choice-copy"><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.hint || '')}</small></span>${withChevron ? '<span class="visual-choice-chevron" aria-hidden="true"></span>' : ''}`;
}

function toggleVisualDropdown(dropdown) {
  const isOpen = dropdown.classList.contains('is-open');
  closeAllVisualDropdowns();
  if (!isOpen) openVisualDropdown(dropdown);
}

function openVisualDropdown(dropdown) {
  dropdown.classList.add('is-open');
  dropdown.querySelector('.visual-choice-trigger')?.setAttribute('aria-expanded', 'true');
}

function closeVisualDropdown(dropdown) {
  dropdown.classList.remove('is-open');
  dropdown.querySelector('.visual-choice-trigger')?.setAttribute('aria-expanded', 'false');
}

function closeAllVisualDropdowns() {
  document.querySelectorAll('.visual-choice-dropdown.is-open').forEach(closeVisualDropdown);
}

function bindGlobalDropdownClose() {
  if (document.body.dataset.visualDropdownCloseBound === 'true') return;
  document.body.dataset.visualDropdownCloseBound = 'true';
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.visual-choice-dropdown')) closeAllVisualDropdowns();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllVisualDropdowns();
  });
}

function bindDemoRefresh() {
  document.querySelector('#load-demo')?.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      enhanceNumberSteppers();
      enhanceVisualDropdowns();
      document.querySelectorAll('select').forEach((select) => {
        renderStepper(select);
        syncVisualDropdown(select);
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
