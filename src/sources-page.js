import { SOURCES } from './data/sources.js';

const container = document.querySelector('#sources-list');

if (container) {
  container.innerHTML = SOURCES.map((source) => `
    <li>
      <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.organization} — ${source.title}</a>
      <span>${source.year} · Utilisé pour : ${source.usedFor.join(', ')}</span>
    </li>
  `).join('');
}
