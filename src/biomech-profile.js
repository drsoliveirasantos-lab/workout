import { BODY_ART } from './data/bodyArt.js';

const ZONES = {
  global: {
    label: 'Vue globale',
    score: 78,
    reliability: 74,
    level: 'Bon',
    subzones: [['Poussée / pectoraux', 82], ['Jambes antérieures', 80], ['Dos / tirages', 63], ['Épaules largeur', 58]],
    strengths: ['Poussée horizontale solide', 'Quadriceps dominants', 'Triceps bien contributeurs'],
    weaknesses: ['Haut des pectoraux à surveiller', 'Deltoïde latéral à renforcer', 'Ischios moins documentés'],
    sources: ['Développé couché', 'Développé incliné haltères', 'Pec deck', 'Leg press 45°', 'Développé assis'],
    recommendation: 'Compléter un tirage vertical, une élévation latérale et un leg curl pour rendre la carte plus fiable.',
    parts: ['pec_sternal', 'vaste_lateral', 'droit_femoral', 'triceps_long']
  },
  pecs: {
    label: 'Pectoraux', score: 81, reliability: 86, level: 'Fort',
    subzones: [['Haut des pectoraux', 68], ['Milieu des pectoraux', 86], ['Bas des pectoraux', 74], ['Stabilité haltères', 62]],
    strengths: ['Milieu des pectoraux dominant', 'Poussée horizontale fiable', 'Isolation pec deck cohérente'],
    weaknesses: ['Haut des pectoraux en retard relatif', 'Stabilité haltères un peu moins forte que la barre'],
    sources: ['Développé couché', 'Développé incliné barre', 'Développé incliné haltères', 'Pec deck'],
    recommendation: 'Garder une base de développé couché, ajouter un rappel incliné et conserver un écarté contrôlé.',
    parts: ['pec_claviculaire', 'pec_sternal', 'pec_costal']
  },
  back: {
    label: 'Dos', score: 64, reliability: 56, level: 'Correct',
    subzones: [['Largeur / grand dorsal', 61], ['Épaisseur / rhomboïdes', 68], ['Trapèzes', 59], ['Lombaires', 52]],
    strengths: ['Rowing utilisable comme repère', 'Épaisseur du dos mieux documentée que la largeur'],
    weaknesses: ['Tirage vertical à compléter', 'Pullover ou traction assistée manquants'],
    sources: ['Rowing machine', 'Rameur bas prise triangle'],
    recommendation: 'Ajouter un test de tirage vertical pour améliorer la lecture largeur/épaisseur.',
    parts: ['grand_dorsal', 'trapezes']
  },
  shoulders: {
    label: 'Épaules', score: 60, reliability: 58, level: 'Correct',
    subzones: [['Deltoïde antérieur', 72], ['Deltoïde latéral', 54], ['Deltoïde postérieur', 48]],
    strengths: ['Développé épaules correctement calibré', 'Deltoïde antérieur bien documenté'],
    weaknesses: ['Deltoïde latéral à compléter', 'Deltoïde postérieur peu documenté'],
    sources: ['Développé assis', 'Shoulder press machine'],
    recommendation: 'Ajouter élévation latérale poulie et face pull pour équilibrer la carte épaules.',
    parts: ['deltoide_anterieur', 'deltoide_posterieur']
  },
  arms: {
    label: 'Bras', score: 69, reliability: 61, level: 'Bon',
    subzones: [['Triceps', 75], ['Biceps', 63], ['Avant-bras', 54]],
    strengths: ['Triceps soutenus par les développés', 'Pushdown utile pour isoler'],
    weaknesses: ['Curl direct à calibrer pour mieux isoler biceps', 'Avant-bras peu mesurés'],
    sources: ['Extension triceps corde', 'Développé couché', 'Curl barre'],
    recommendation: 'Ajouter un curl câble ou haltères pour séparer biceps, brachial et avant-bras.',
    parts: ['biceps', 'triceps_long', 'avant_bras']
  },
  legs: {
    label: 'Jambes', score: 79, reliability: 76, level: 'Fort',
    subzones: [['Quadriceps', 84], ['Fessiers', 72], ['Ischios', 61], ['Adducteurs', 58]],
    strengths: ['Dominance quadriceps claire', 'Hack squat / leg press très utiles', 'Bonne poussée jambes'],
    weaknesses: ['Ischios à compléter avec leg curl', 'Chaîne postérieure moins précise'],
    sources: ['Hack squat', 'Leg press 45°', 'Leg extension', 'Hip thrust'],
    recommendation: 'Garder le hack squat/leg press et ajouter un leg curl pour équilibrer quadriceps/ischios.',
    parts: ['vaste_lateral', 'vaste_medial', 'droit_femoral', 'vaste_intermediaire', 'ischios']
  },
  glutes: {
    label: 'Fessiers', score: 72, reliability: 66, level: 'Bon',
    subzones: [['Grand fessier', 76], ['Moyen fessier', 62], ['Extension de hanche', 74]],
    strengths: ['Hip thrust très informatif', 'Bonne contribution sur leg press'],
    weaknesses: ['Abduction hanche non mesurée', 'Unilatéral à documenter'],
    sources: ['Hip thrust', 'Leg press 45°', 'RDL'],
    recommendation: 'Ajouter hip thrust machine ou abduction pour affiner grand/moyen fessier.',
    parts: ['grand_fessier']
  },
  calves: {
    label: 'Mollets', score: 55, reliability: 42, level: 'Correct',
    subzones: [['Gastrocnémien', 58], ['Soléaire', 50], ['Stabilité pied', 44]],
    strengths: ['Base debout exploitable'],
    weaknesses: ['Mollets assis manquants', 'Soléaire peu documenté'],
    sources: ['Mollets debout machine'],
    recommendation: 'Ajouter mollets assis pour séparer gastrocnémien et soléaire.',
    parts: ['gastrocnemien']
  },
  core: {
    label: 'Core / abdos', score: 62, reliability: 40, level: 'Correct',
    subzones: [['Gainage', 64], ['Flexion tronc', 60], ['Stabilité lombaire', 55]],
    strengths: ['Core présent dans les mouvements libres'],
    weaknesses: ['Peu de tests directs', 'Endurance spécifique à mesurer'],
    sources: ['Gainage', 'Squat Smith', 'RDL'],
    recommendation: 'Ajouter un test simple de gainage ou crunch lesté si tu veux suivre le core.',
    parts: ['abdos', 'lombaires']
  }
};

const state = { zone: 'global', view: 'front' };

function init() {
  loadBodyArtwork();
  renderTabs();
  bindEvents();
  renderZone('global');
  renderGlobalCards();
}

function loadBodyArtwork() {
  const front = document.querySelector('#body-art-front');
  const back = document.querySelector('#body-art-back');
  if (front) front.src = BODY_ART.front;
  if (back) back.src = BODY_ART.back;
}

function renderTabs() {
  const tabs = document.querySelector('#zone-tabs');
  if (!tabs) return;
  tabs.innerHTML = Object.entries(ZONES).map(([id, zone]) => `
    <button class="zone-tab" type="button" data-zone="${id}" role="tab">
      <span>${zone.label}</span><small>${zone.score}/100</small>
    </button>
  `).join('');
}

function bindEvents() {
  document.querySelector('#zone-tabs')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-zone]');
    if (button) renderZone(button.dataset.zone);
  });

  document.querySelector('.body-hotspots')?.addEventListener('click', (event) => {
    const hotspot = event.target.closest('[data-zone]');
    if (hotspot) renderZone(hotspot.dataset.zone);
  });

  document.querySelector('#toggle-view')?.addEventListener('click', () => {
    state.view = state.view === 'front' ? 'back' : 'front';
    document.querySelector('#body-stage')?.classList.toggle('is-back', state.view === 'back');
    document.querySelector('#toggle-view').textContent = state.view === 'front' ? 'Vue arrière' : 'Vue avant';
    paintBody(state.zone, ZONES[state.zone] || ZONES.global);
  });
}

function renderZone(zoneId) {
  const zone = ZONES[zoneId] || ZONES.global;
  state.zone = zoneId;

  document.querySelectorAll('.zone-tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.zone === zoneId));
  document.querySelector('#zone-eyebrow').textContent = zoneId === 'global' ? 'Synthèse' : 'Zone sélectionnée';
  document.querySelector('#zone-title').textContent = zone.label;
  document.querySelector('#zone-score').textContent = `${zone.score}/100`;
  document.querySelector('#zone-level').textContent = zone.level;
  document.querySelector('#zone-reliability').textContent = `Fiabilité ${zone.reliability}%`;
  document.querySelector('#subzones').innerHTML = zone.subzones.map(([label, score]) => `
    <div class="subzone-row"><strong>${label}</strong><span>${score}/100</span><div class="subzone-bar" style="--score:${score}%"><span></span></div></div>
  `).join('');
  fillList('#strength-list', zone.strengths);
  fillList('#weakness-list', zone.weaknesses);
  fillList('#source-list', zone.sources);
  document.querySelector('#recommendation-text').textContent = zone.recommendation;
  paintBody(zoneId, zone);
}

function fillList(selector, items) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function paintBody(zoneId, zone) {
  const map = document.querySelector('.body-hotspots');
  if (!map) return;
  map.dataset.zone = zoneId;
  map.querySelectorAll('.hotspot').forEach((hotspot) => {
    hotspot.classList.remove('is-active', 'strength-hot', 'strength-warm', 'strength-mid', 'strength-low');
    const active = zoneId === 'global'
      ? zone.parts.includes(hotspot.dataset.part)
      : hotspot.dataset.zone === zoneId || zone.parts.includes(hotspot.dataset.part);
    if (!active) return;
    hotspot.classList.add('is-active', strengthClass(zone.score));
  });
}

function strengthClass(score) {
  if (score >= 78) return 'strength-hot';
  if (score >= 68) return 'strength-warm';
  if (score >= 55) return 'strength-mid';
  return 'strength-low';
}

function renderGlobalCards() {
  const cards = document.querySelector('#global-cards');
  if (!cards) return;
  const zones = Object.values(ZONES).filter((zone) => zone !== ZONES.global);
  const strongest = zones.toSorted((a, b) => b.score - a.score).slice(0, 3);
  const weakest = zones.toSorted((a, b) => a.score - b.score).slice(0, 3);
  cards.innerHTML = `
    <article><strong>Points forts</strong><p>${strongest.map((zone) => zone.label).join(' · ')}</p></article>
    <article><strong>À renforcer</strong><p>${weakest.map((zone) => zone.label).join(' · ')}</p></article>
    <article><strong>Données à compléter</strong><p>Dos, épaules latérales, ischios et mollets assis donnent la meilleure précision supplémentaire.</p></article>
  `;
}

init();
