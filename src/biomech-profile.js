const BODY_MAPS = {
  front: 'body_front_zones.svg?v=20260703-clean1',
  back: 'body_back.svg?v=20260703-clean1'
};

const z = (label, score, reliability, level, subzones, strengths, weaknesses, sources, recommendation, parts) => ({ label, score, reliability, level, subzones, strengths, weaknesses, sources, recommendation, parts });

const ZONES = {
  global: z('Vue globale', 78, 74, 'Bon', [['Poussée / pectoraux', 82], ['Jambes antérieures', 80], ['Dos / tirages', 63], ['Épaules largeur', 58]], ['Poussée horizontale solide', 'Quadriceps dominants', 'Triceps bien contributeurs'], ['Haut des pectoraux à surveiller', 'Deltoïde latéral à renforcer', 'Ischios moins documentés'], ['Développé couché', 'Développé incliné haltères', 'Pec deck', 'Leg press 45°', 'Développé assis'], 'Compléter un tirage vertical, une élévation latérale et un leg curl pour rendre la carte plus fiable.', []),
  pecs: z('Pectoraux', 81, 86, 'Fort', [['Haut des pectoraux', 68], ['Milieu des pectoraux', 86], ['Bas des pectoraux', 74], ['Stabilité haltères', 62]], ['Milieu des pectoraux dominant', 'Poussée horizontale fiable', 'Isolation pec deck cohérente'], ['Haut des pectoraux en retard relatif', 'Stabilité haltères un peu moins forte que la barre'], ['Développé couché', 'Développé incliné barre', 'Développé incliné haltères', 'Pec deck'], 'Garder une base de développé couché, ajouter un rappel incliné et conserver un écarté contrôlé.', ['pec_claviculaire', 'pec_sternal', 'pec_costal']),
  back: z('Dos', 64, 56, 'Correct', [['Largeur / grand dorsal', 61], ['Épaisseur / rhomboïdes', 68], ['Trapèzes', 59], ['Coiffe postérieure', 55]], ['Rowing utilisable comme repère', 'Épaisseur du dos mieux documentée que la largeur'], ['Tirage vertical à compléter', 'Pullover ou traction assistée manquants'], ['Rowing machine', 'Rameur bas prise triangle'], 'Ajouter un test de tirage vertical pour améliorer la lecture largeur/épaisseur.', ['grand_dorsal', 'trapezes', 'rhomboides', 'infra_epineux', 'grand_rond', 'petit_rond']),
  shoulders: z('Épaules', 60, 58, 'Correct', [['Deltoïde antérieur', 72], ['Deltoïde latéral', 54], ['Deltoïde postérieur', 48]], ['Développé épaules correctement calibré', 'Deltoïde antérieur bien documenté'], ['Deltoïde latéral à compléter', 'Deltoïde postérieur peu documenté'], ['Développé assis', 'Shoulder press machine'], 'Ajouter élévation latérale poulie et face pull pour équilibrer la carte épaules.', ['deltoide_anterieur', 'deltoide_lateral', 'deltoide_posterieur']),
  arms: z('Bras', 69, 61, 'Bon', [['Triceps', 75], ['Biceps', 63], ['Avant-bras', 54]], ['Triceps soutenus par les développés', 'Pushdown utile pour isoler'], ['Curl direct à calibrer pour mieux isoler biceps', 'Avant-bras peu mesurés'], ['Extension triceps corde', 'Développé couché', 'Curl barre'], 'Ajouter un curl câble ou haltères pour séparer biceps, brachial et avant-bras.', ['biceps', 'triceps', 'avant_bras']),
  legs: z('Jambes', 79, 76, 'Fort', [['Quadriceps', 84], ['Fessiers', 72], ['Ischios', 61], ['Adducteurs', 58]], ['Dominance quadriceps claire', 'Hack squat / leg press très utiles', 'Bonne poussée jambes'], ['Ischios à compléter avec leg curl', 'Chaîne postérieure moins précise'], ['Hack squat', 'Leg press 45°', 'Leg extension', 'Hip thrust'], 'Garder le hack squat/leg press et ajouter un leg curl pour équilibrer quadriceps/ischios.', ['vaste_lateral', 'vaste_medial', 'droit_femoral', 'semimembraneux', 'semitendineux', 'biceps_femoral', 'sartorius', 'gracile', 'grand_adducteur', 'long_adducteur', 'pectine']),
  glutes: z('Fessiers', 72, 66, 'Bon', [['Grand fessier', 76], ['Moyen fessier', 62], ['Extension de hanche', 74]], ['Hip thrust très informatif', 'Bonne contribution sur leg press'], ['Abduction hanche non mesurée', 'Unilatéral à documenter'], ['Hip thrust', 'Leg press 45°', 'RDL'], 'Ajouter hip thrust machine ou abduction pour affiner grand/moyen fessier.', ['grand_fessier', 'moyen_fessier', 'tenseur_fascia_lata']),
  calves: z('Mollets', 55, 42, 'Correct', [['Gastrocnémien', 58], ['Soléaire', 50], ['Stabilité pied', 44]], ['Base debout exploitable'], ['Mollets assis manquants', 'Soléaire peu documenté'], ['Mollets debout machine'], 'Ajouter mollets assis pour séparer gastrocnémien et soléaire.', ['gastrocnemien', 'soleaire']),
  core: z('Core / abdos', 62, 40, 'Correct', [['Abdominaux', 64], ['Obliques / dentelé', 60], ['Stabilité lombaire', 55]], ['Core présent dans les mouvements libres'], ['Peu de tests directs', 'Endurance spécifique à mesurer'], ['Gainage', 'Squat Smith', 'RDL'], 'Ajouter un test simple de gainage ou crunch lesté si tu veux suivre le core.', ['abdos', 'obliques', 'lombaires', 'serratus_anterior', 'psoas', 'iliaque'])
};

const HUD_ZONES = [
  { id: 'shoulders', slot: 'top-left', icon: '⌃' },
  { id: 'pecs', slot: 'top-right', icon: '◎' },
  { id: 'arms', slot: 'mid-left', icon: '↯' },
  { id: 'core', slot: 'mid-right', icon: '▦' },
  { id: 'back', slot: 'low-left', icon: '◇' },
  { id: 'glutes', slot: 'low-right', icon: '⌁' },
  { id: 'legs', slot: 'bottom-left', icon: '⋀' },
  { id: 'calves', slot: 'bottom-right', icon: '⋁' }
];

const ZONE_DEFAULT_VIEW = {
  pecs: 'front',
  core: 'front',
  legs: 'front',
  back: 'back',
  glutes: 'back'
};

const state = { zone: 'global', view: 'front' };

async function init() {
  renderTabs();
  renderHudCards();
  bindEvents();
  renderZone('global');
  renderGlobalCards();
  await loadBodyMaps();
}

async function loadBodyMaps() {
  const mount = document.querySelector('#body-map-mount');
  if (!mount) return;
  mount.innerHTML = '<div class="body-map-loading">Chargement des SVG anatomiques…</div>';

  try {
    const [frontSvg, backSvg] = await Promise.all([
      fetchAndPrepareSvg(BODY_MAPS.front, 'front'),
      fetchAndPrepareSvg(BODY_MAPS.back, 'back')
    ]);
    mount.replaceChildren(frontSvg, backSvg);
    setView(state.view);
    paintBody(state.zone, ZONES[state.zone] || ZONES.global);
  } catch (error) {
    console.error(error);
    mount.innerHTML = `<div class="body-map-error">Impossible de charger les SVG anatomiques.<br><small>${escapeHtml(error.message || String(error))}</small></div>`;
  }
}

async function fetchAndPrepareSvg(url, view) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url} introuvable: ${response.status}`);
  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) throw new Error(`${url} est invalide`);
  const svg = doc.documentElement;
  if (!svg || svg.tagName.toLowerCase() !== 'svg') throw new Error(`${url} ne contient pas de SVG`);

  svg.classList.add('body-map-svg', `body-map-${view}`);
  svg.dataset.view = view;
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', view === 'front' ? 'Carte musculaire avant' : 'Carte musculaire arrière');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  normalizeViewBox(svg);
  enhanceHotspots(svg);
  return document.importNode(svg, true);
}

function normalizeViewBox(svg) {
  const image = svg.querySelector('image');
  if (!image) return;
  const x = numberAttr(image, 'x');
  const y = numberAttr(image, 'y');
  const width = numberAttr(image, 'width');
  const height = numberAttr(image, 'height');
  if (width > 0 && height > 0) {
    svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
  }
}

function enhanceHotspots(svg) {
  svg.querySelectorAll('path, polygon, polyline').forEach((node, index) => {
    const rawLabel = node.getAttribute('inkscape:label') || node.getAttribute('aria-label') || node.id || `zone_${index}`;
    const { zone, part, name } = classifyLabel(rawLabel);
    node.classList.add('hotspot', zone);
    node.dataset.zone = zone;
    node.dataset.part = part;
    node.dataset.label = name;
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', name);
    if (!node.querySelector('title')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = name;
      node.prepend(title);
    }
  });
}

function classifyLabel(label) {
  const text = normalizeText(label);
  if (text.includes('trap')) return part('back', 'trapezes', 'Trapèzes');
  if (text.includes('lombaire') || text.includes('erect')) return part('core', 'lombaires', 'Lombaires');
  if (text.includes('grand dorsal') || text.includes('latimus') || text.includes('dorsal')) return part('back', 'grand_dorsal', 'Grand dorsal');
  if (text.includes('rhombo')) return part('back', 'rhomboides', 'Rhomboïdes');
  if (text.includes('infra')) return part('back', 'infra_epineux', 'Infra-épineux');
  if (text.includes('petit rond')) return part('back', 'petit_rond', 'Petit rond');
  if (text.includes('grand rond')) return part('back', 'grand_rond', 'Grand rond');
  if (text.includes('deltoide posterieur')) return part('shoulders', 'deltoide_posterieur', 'Deltoïde postérieur');
  if (text.includes('deltoide anterieur')) return part('shoulders', 'deltoide_anterieur', 'Deltoïde antérieur');
  if (text.includes('deltoide lateral') || text.includes('deeltoide lateral') || /^deltoide [idg]$/.test(text)) return part('shoulders', 'deltoide_lateral', 'Deltoïde latéral');
  if (text.includes('triceps') || text.includes('tricpes')) return part('arms', 'triceps', 'Triceps');
  if (text.includes('biceps') && !text.includes('femor')) return part('arms', 'biceps', 'Biceps');
  if (text.includes('gluteus maximus')) return part('glutes', 'grand_fessier', 'Grand fessier');
  if (text.includes('gluteus medius')) return part('glutes', 'moyen_fessier', 'Moyen fessier');
  if (text.includes('tensor fasciae') || text.includes('tensor de la fascia')) return part('glutes', 'tenseur_fascia_lata', 'Tenseur du fascia lata');
  if (text.includes('semimembr') || text.includes('semimenb')) return part('legs', 'semimembraneux', 'Semi-membraneux');
  if (text.includes('semitend')) return part('legs', 'semitendineux', 'Semi-tendineux');
  if (text.includes('biceps femor')) return part('legs', 'biceps_femoral', 'Biceps fémoral');
  if (text.includes('vasto medial')) return part('legs', 'vaste_medial', 'Vaste médial');
  if (text.includes('vast') && text.includes('lateral')) return part('legs', 'vaste_lateral', 'Vaste latéral');
  if (text.includes('recto femoral')) return part('legs', 'droit_femoral', 'Droit fémoral');
  if (text.includes('sartorus') || text.includes('sartorius')) return part('legs', 'sartorius', 'Sartorius');
  if (text.includes('gracil') || text.includes('gracis')) return part('legs', 'gracile', 'Gracile');
  if (text.includes('adductor mayor')) return part('legs', 'grand_adducteur', 'Grand adducteur');
  if (text.includes('adductor largo')) return part('legs', 'long_adducteur', 'Long adducteur');
  if (text.includes('pectineo')) return part('legs', 'pectine', 'Pectiné');
  if (text.includes('psoas')) return part('core', 'psoas', 'Psoas');
  if (text.includes('iliaco')) return part('core', 'iliaque', 'Iliaque');
  if (text.includes('molet') || text.includes('mollet')) return part('calves', 'gastrocnemien', 'Mollets');
  if (text.includes('pec') && text.includes('clavicul')) return part('pecs', 'pec_claviculaire', 'Pectoral claviculaire');
  if (text.includes('pec') && (text.includes('abdominal') || text.includes('costal'))) return part('pecs', 'pec_costal', 'Pectoral costal');
  if (text.includes('pec')) return part('pecs', 'pec_sternal', 'Pectoral sternal');
  if (text.includes('abdominal')) return part('core', 'abdos', 'Abdominaux');
  if (text.includes('oblique')) return part('core', 'obliques', 'Obliques');
  if (text.includes('seratus') || text.includes('serratus')) return part('core', 'serratus_anterior', 'Dentelé antérieur');
  return part('other', text.replace(/[^a-z0-9]+/g, '_') || 'zone', label || 'Zone');
}

function part(zone, partName, name) {
  return { zone, part: partName, name };
}

function normalizeText(value) {
  return (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function numberAttr(node, name) {
  return Number.parseFloat(node.getAttribute(name) || '0');
}

function renderTabs() {
  const tabs = document.querySelector('#zone-tabs');
  if (!tabs) return;
  tabs.innerHTML = Object.entries(ZONES).map(([id, zone]) => `<button class="zone-tab" type="button" data-zone="${id}" role="tab"><span>${zone.label}</span><small>${zone.score}/100</small></button>`).join('');
}

function renderHudCards() {
  const host = document.querySelector('#hud-zone-cards');
  if (!host) return;
  host.innerHTML = HUD_ZONES.map(({ id, slot, icon }) => {
    const zone = ZONES[id];
    const status = statusForScore(zone.score);
    return `<button class="hud-zone-card ${statusClass(zone.score)}" data-slot="${slot}" data-zone="${id}" type="button" aria-label="Sélectionner ${zone.label}">
      <span class="hud-card-top"><i>${icon}</i><b>${zone.label}</b></span>
      <span class="hud-card-score">${zone.score}<small>%</small></span>
      <span class="hud-card-status">${status}</span>
      <span class="hud-card-bar" style="--score:${zone.score}%"><i></i></span>
    </button>`;
  }).join('');
}

function bindEvents() {
  document.querySelector('#zone-tabs')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-zone]');
    if (button) renderZone(button.dataset.zone);
  });

  document.querySelector('#hud-zone-cards')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-zone]');
    if (button) renderZone(button.dataset.zone);
  });

  document.querySelector('#body-map-mount')?.addEventListener('click', (event) => {
    const hotspot = event.target.closest('.hotspot');
    if (hotspot?.dataset.zone && hotspot.dataset.zone !== 'other') renderZone(hotspot.dataset.zone);
  });

  document.querySelector('#body-map-mount')?.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const hotspot = event.target.closest('.hotspot');
    if (hotspot?.dataset.zone && hotspot.dataset.zone !== 'other') {
      event.preventDefault();
      renderZone(hotspot.dataset.zone);
    }
  });

  document.querySelector('#toggle-view')?.addEventListener('click', () => {
    setView(state.view === 'front' ? 'back' : 'front');
    paintBody(state.zone, ZONES[state.zone] || ZONES.global);
  });
}

function renderZone(zoneId) {
  const zone = ZONES[zoneId] || ZONES.global;
  const preferredView = ZONE_DEFAULT_VIEW[zoneId];
  if (preferredView && preferredView !== state.view) setView(preferredView);

  state.zone = zoneId;
  document.querySelectorAll('.zone-tab, .hud-zone-card').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.zone === zoneId));
  document.querySelector('#zone-eyebrow').textContent = zoneId === 'global' ? 'Synthèse' : 'Zone sélectionnée';
  document.querySelector('#zone-title').textContent = zone.label;
  document.querySelector('#zone-score').textContent = `${zone.score}/100`;
  document.querySelector('#zone-level').textContent = zone.level;
  document.querySelector('#zone-reliability').textContent = `Fiabilité ${zone.reliability}%`;
  document.querySelector('#subzones').innerHTML = zone.subzones.map(([label, score]) => `<div class="subzone-row"><strong>${label}</strong><span>${score}/100</span><div class="subzone-bar" style="--score:${score}%"><span></span></div></div>`).join('');
  fillList('#strength-list', zone.strengths);
  fillList('#weakness-list', zone.weaknesses);
  fillList('#source-list', zone.sources);
  document.querySelector('#recommendation-text').textContent = zone.recommendation;
  paintBody(zoneId, zone);
}

function setView(view) {
  state.view = view;
  const stage = document.querySelector('#body-stage');
  const toggle = document.querySelector('#toggle-view');
  stage?.classList.toggle('is-back', view === 'back');
  if (toggle) toggle.textContent = view === 'front' ? 'Vue arrière' : 'Vue avant';
}

function paintBody(zoneId, zone) {
  const map = document.querySelector('#body-map-mount');
  if (!map) return;
  map.dataset.zone = zoneId;
  map.querySelectorAll('.hotspot').forEach((hotspot) => {
    hotspot.classList.remove('is-active', 'strength-hot', 'strength-warm', 'strength-mid', 'strength-low');
    if (zoneId === 'global') return;
    const active = hotspot.dataset.zone === zoneId || zone.parts.includes(hotspot.dataset.part);
    if (active) hotspot.classList.add('is-active', strengthClass(zone.score));
  });
}

function fillList(selector, items) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function statusForScore(score) {
  if (score >= 75) return 'Fort';
  if (score >= 60) return 'Équilibré';
  return 'À renforcer';
}

function statusClass(score) {
  if (score >= 75) return 'strong';
  if (score >= 60) return 'balanced';
  return 'weak';
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
  cards.innerHTML = `<article><strong>Points forts</strong><p>${strongest.map((zone) => zone.label).join(' · ')}</p></article><article><strong>À renforcer</strong><p>${weakest.map((zone) => zone.label).join(' · ')}</p></article><article><strong>Données à compléter</strong><p>Dos, épaules latérales, ischios et mollets assis donnent la meilleure précision supplémentaire.</p></article>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

init();
