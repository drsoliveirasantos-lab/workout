const pickerConfig = {
  age: { unit: 'ans', aria: 'âge' },
  heightCm: { unit: 'cm', aria: 'taille' },
  weightKg: { unit: 'kg', aria: 'poids' }
};

const visualChoiceMeta = {
  sex: {
    className: 'sex-card-group',
    items: {
      male: { icon: '♂', label: 'Homme', hint: 'Calcul BMR masculin' },
      female: { icon: '♀', label: 'Femme', hint: 'Calcul BMR féminin' }
    }
  },
  physicalProfile: {
    className: 'physique-card-group',
    items: {
      unknown: { icon: '◇', label: 'Standard', hint: 'Profil neutre' },
      lean_low_muscle: { icon: '◌', label: 'Mince peu musclé', hint: 'Volume progressif' },
      lean_athletic: { icon: '↯', label: 'Mince sportif', hint: 'Profil actif' },
      standard: { icon: '◎', label: 'Standard', hint: 'Base équilibrée' },
      muscular_lean: { icon: '◆', label: 'Musclé sec', hint: 'Performance visible' },
      muscular_soft: { icon: '◈', label: 'Musclé + gras', hint: 'Force + recomposition' },
      overweight_low_muscle: { icon: '●', label: 'Surpoids peu musclé', hint: 'Priorité technique' },
      overweight_muscular: { icon: '⬢', label: 'Surpoids musclé', hint: 'Force élevée' }
    }
  }
};

function initVisualPickers() {
  injectVisualPickerStyles();
  enhanceNumberWheels();
  enhanceVisualCards();
  bindDemoRefresh();
}

function injectVisualPickerStyles() {
  if (document.querySelector('link[data-visual-pickers]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'src/visual-pickers.css?v=20260703-picker1';
  link.dataset.visualPickers = 'true';
  document.head.appendChild(link);
}

function enhanceNumberWheels(root = document) {
  Object.keys(pickerConfig).forEach((name) => {
    const select = root.querySelector(`select[name="${name}"]`);
    if (!select || select.dataset.wheelEnhanced === 'true') return;
    select.dataset.wheelEnhanced = 'true';
    select.classList.add('visual-picker-native');
    const wheel = document.createElement('div');
    wheel.className = 'number-wheel';
    wheel.dataset.wheelFor = name;
    wheel.innerHTML = `
      <button class="number-wheel-btn" type="button" data-wheel-step="-1" aria-label="Diminuer ${pickerConfig[name].aria}">−</button>
      <div class="number-wheel-track" role="listbox" aria-label="Sélecteur compact ${pickerConfig[name].aria}"></div>
      <button class="number-wheel-btn" type="button" data-wheel-step="1" aria-label="Augmenter ${pickerConfig[name].aria}">+</button>`;
    select.insertAdjacentElement('afterend', wheel);

    wheel.addEventListener('click', (event) => {
      const stepButton = event.target.closest('[data-wheel-step]');
      const valueButton = event.target.closest('[data-wheel-value]');
      if (stepButton) shiftSelect(select, Number(stepButton.dataset.wheelStep));
      if (valueButton) setSelectValue(select, valueButton.dataset.wheelValue);
    });

    wheel.addEventListener('wheel', (event) => {
      event.preventDefault();
      shiftSelect(select, event.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    let startY = null;
    wheel.addEventListener('touchstart', (event) => { startY = event.touches[0]?.clientY ?? null; }, { passive: true });
    wheel.addEventListener('touchend', (event) => {
      if (startY === null) return;
      const endY = event.changedTouches[0]?.clientY ?? startY;
      const diff = startY - endY;
      if (Math.abs(diff) > 18) shiftSelect(select, diff > 0 ? 1 : -1);
      startY = null;
    });

    select.addEventListener('change', () => renderWheel(select));
    renderWheel(select);
  });
}

function renderWheel(select) {
  const wheel = select.nextElementSibling?.classList?.contains('number-wheel') ? select.nextElementSibling : null;
  if (!wheel) return;
  const track = wheel.querySelector('.number-wheel-track');
  const options = [...select.options];
  const currentIndex = Math.max(0, options.findIndex((option) => option.selected));
  const name = select.name;
  const unit = pickerConfig[name]?.unit || '';
  const items = [-2, -1, 0, 1, 2].map((offset) => {
    const index = Math.min(options.length - 1, Math.max(0, currentIndex + offset));
    const option = options[index];
    const distance = Math.abs(offset);
    const selected = offset === 0;
    return `<button class="number-wheel-value ${selected ? 'is-selected' : ''}" data-distance="${distance}" data-wheel-value="${escapeAttr(option.value)}" type="button" role="option" aria-selected="${selected ? 'true' : 'false'}">${escapeHtml(option.textContent || `${option.value} ${unit}`)}</button>`;
  }).join('');
  track.innerHTML = items;
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
  renderWheel(select);
  syncVisualCardGroup(select);
}

function enhanceVisualCards(root = document) {
  Object.entries(visualChoiceMeta).forEach(([name, config]) => {
    const select = root.querySelector(`select[name="${name}"]`);
    if (!select || select.dataset.cardEnhanced === 'true') return;
    select.dataset.cardEnhanced = 'true';
    select.classList.add('visual-picker-native');
    const group = document.createElement('div');
    group.className = `visual-card-group ${config.className}`;
    group.dataset.cardFor = name;
    select.insertAdjacentElement('afterend', group);
    group.addEventListener('click', (event) => {
      const card = event.target.closest('[data-card-value]');
      if (!card) return;
      setSelectValue(select, card.dataset.cardValue);
    });
    select.addEventListener('change', () => syncVisualCardGroup(select));
    syncVisualCardGroup(select);
  });
}

function syncVisualCardGroup(select) {
  const group = select.nextElementSibling?.classList?.contains('visual-card-group') ? select.nextElementSibling : null;
  if (!group) return;
  const meta = visualChoiceMeta[select.name];
  group.innerHTML = [...select.options].map((option) => {
    const item = meta.items[option.value] || { icon: '◇', label: option.textContent, hint: '' };
    const selected = option.value === select.value;
    return `<button class="visual-choice-card ${selected ? 'is-selected' : ''}" type="button" data-card-value="${escapeAttr(option.value)}" aria-pressed="${selected ? 'true' : 'false'}">
      <span class="visual-choice-icon">${escapeHtml(item.icon)}</span>
      <span class="visual-choice-body"><strong>${escapeHtml(item.label || option.textContent)}</strong><small>${escapeHtml(item.hint || option.textContent)}</small></span>
    </button>`;
  }).join('');
}

function bindDemoRefresh() {
  document.querySelector('#load-demo')?.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      enhanceNumberWheels();
      enhanceVisualCards();
      document.querySelectorAll('select').forEach((select) => {
        renderWheel(select);
        syncVisualCardGroup(select);
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
