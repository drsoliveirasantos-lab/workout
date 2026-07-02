import { GLOSSARY } from './data/glossary.js';

function ensureGlossaryPanel() {
  let panel = document.querySelector('#glossary-panel');

  if (panel) return panel;

  panel = document.createElement('aside');
  panel.id = 'glossary-panel';
  panel.className = 'glossary-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-live', 'polite');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="glossary-panel-inner">
      <button class="glossary-close" type="button" aria-label="Fermer la définition">×</button>
      <p class="eyebrow">Définition</p>
      <h2 id="glossary-title"></h2>
      <p id="glossary-definition"></p>
      <p id="glossary-detail" class="muted"></p>
    </div>
  `;

  document.body.append(panel);
  panel.querySelector('.glossary-close').addEventListener('click', closeGlossary);
  return panel;
}

function openGlossary(termKey) {
  const entry = GLOSSARY[termKey];
  if (!entry) return;

  const panel = ensureGlossaryPanel();
  panel.querySelector('#glossary-title').textContent = entry.title;
  panel.querySelector('#glossary-definition').textContent = entry.definition;
  panel.querySelector('#glossary-detail').textContent = entry.detail || '';
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}

function closeGlossary() {
  const panel = document.querySelector('#glossary-panel');
  if (!panel) return;

  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
}

function bindGlossary() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-glossary]');
    if (!trigger) return;

    event.preventDefault();
    openGlossary(trigger.dataset.glossary);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeGlossary();
  });
}

bindGlossary();
