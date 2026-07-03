import { GLOSSARY } from './data/glossary.js';

const AUTO_GLOSSARY_TERMS = [
  { key: 'trainingMax', label: 'Training Max' },
  { key: 'doubleProgression', label: 'Double progression' },
  { key: 'submaximal', label: 'série sous-maximale' },
  { key: 'submaximal', label: 'série sous-maximale' },
  { key: 'e1rm', label: 'e1RM' },
  { key: 'oneRm', label: '1RM' },
  { key: 'rir', label: 'RIR' },
  { key: 'rpe', label: 'RPE' },
  { key: 'bmr', label: 'BMR' },
  { key: 'deload', label: 'Deload' },
  { key: 'deload', label: 'deload' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'maintenance', label: 'maintenance' },
  { key: 'deficit', label: 'déficit' },
  { key: 'surplus', label: 'surplus' },
  { key: 'hypertrophy', label: 'hypertrophie' },
  { key: 'recomposition', label: 'Recomposition' },
  { key: 'reps', label: 'répétitions' },
  { key: 'reps', label: 'reps' }
];

let isDecorating = false;

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

function shouldSkipNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;

  return Boolean(parent.closest('button, a, input, select, textarea, script, style, .glossary-panel, .glossary-term'));
}

function buildGlossaryButton(term) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'glossary-term';
  button.dataset.glossary = term.key;
  button.textContent = term.label;
  return button;
}

function decorateTextNode(textNode) {
  if (shouldSkipNode(textNode)) return;

  const text = textNode.nodeValue;
  const matches = [];

  for (const term of AUTO_GLOSSARY_TERMS) {
    let index = text.indexOf(term.label);

    while (index !== -1) {
      const before = text[index - 1] || '';
      const after = text[index + term.label.length] || '';
      const boundaryBefore = !/[\p{L}\p{N}_]/u.test(before);
      const boundaryAfter = !/[\p{L}\p{N}_]/u.test(after);

      if (boundaryBefore && boundaryAfter) {
        matches.push({ index, end: index + term.label.length, term });
      }

      index = text.indexOf(term.label, index + term.label.length);
    }
  }

  matches.sort((a, b) => a.index - b.index || b.end - a.end);

  const filtered = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.index < cursor) continue;
    filtered.push(match);
    cursor = match.end;
  }

  if (!filtered.length) return;

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  for (const match of filtered) {
    if (match.index > lastIndex) {
      fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    fragment.append(buildGlossaryButton(match.term));
    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    fragment.append(document.createTextNode(text.slice(lastIndex)));
  }

  textNode.replaceWith(fragment);
}

function decorateGlossaryTerms(root = document.body) {
  if (isDecorating) return;
  isDecorating = true;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(decorateTextNode);
  isDecorating = false;
}

function observeDynamicContent() {
  const observer = new MutationObserver((mutations) => {
    if (isDecorating) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) decorateGlossaryTerms(node);
        if (node.nodeType === Node.TEXT_NODE) decorateTextNode(node);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
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
decorateGlossaryTerms();
observeDynamicContent();
