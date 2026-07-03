function isClosedPath(path) {
  return /z\s*$/i.test((path.getAttribute('d') || '').trim());
}

function classifyOpenPaths() {
  document.querySelectorAll('.hotspot').forEach((path) => {
    path.classList.toggle('is-open-path', !isClosedPath(path));
  });
}

function scoreFrontLayer(hotspots) {
  return hotspots.reduce((score, hotspot) => {
    const zone = hotspot.dataset.zone;
    const part = hotspot.dataset.part;
    return score + (['pecs', 'core'].includes(zone) ? 2 : 0) + (['pec_claviculaire', 'pec_sternal', 'pec_costal', 'abdos', 'obliques', 'serratus_anterior'].includes(part) ? 2 : 0);
  }, 0);
}

function scoreBackLayer(hotspots) {
  return hotspots.reduce((score, hotspot) => {
    const zone = hotspot.dataset.zone;
    const part = hotspot.dataset.part;
    return score + (['back', 'glutes'].includes(zone) ? 2 : 0) + (['grand_dorsal', 'trapezes', 'rhomboides', 'infra_epineux', 'grand_rond', 'petit_rond', 'grand_fessier', 'moyen_fessier'].includes(part) ? 2 : 0);
  }, 0);
}

function renameLayerHotspots(layer, prefix) {
  const seen = new Map();
  layer.querySelectorAll('.hotspot').forEach((hotspot) => {
    const part = hotspot.dataset.part || hotspot.dataset.zone || 'zone';
    const side = hotspot.dataset.side || 'center';
    const base = `${prefix}_${part}_${side}`;
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    hotspot.id = count === 1 ? base : `${base}_${count}`;
  });
}

function fixInvertedLayers() {
  const mount = document.querySelector('#body-map-mount');
  const front = mount?.querySelector('.body-map-front .hotspot-layer');
  const back = mount?.querySelector('.body-map-back .hotspot-layer');
  if (!front || !back || front.dataset.orientationFixed === '1') return;

  const frontHits = [...front.querySelectorAll('.hotspot')];
  const backHits = [...back.querySelectorAll('.hotspot')];
  if (!frontHits.length || !backHits.length) return;

  const frontLooksBack = scoreBackLayer(frontHits) > scoreFrontLayer(frontHits);
  const backLooksFront = scoreFrontLayer(backHits) > scoreBackLayer(backHits);

  if (frontLooksBack || backLooksFront) {
    const frontNodes = [...front.childNodes];
    const backNodes = [...back.childNodes];
    front.replaceChildren(...backNodes);
    back.replaceChildren(...frontNodes);
    renameLayerHotspots(front, 'front');
    renameLayerHotspots(back, 'back');
  }

  front.dataset.orientationFixed = '1';
  back.dataset.orientationFixed = '1';
}

function filterMapZones(svg) {
  const image = svg.querySelector('.body-map-image');
  const hotspots = [...svg.querySelectorAll('.hotspot')];
  if (!image || !hotspots.length) return;

  const imageRect = image.getBoundingClientRect();
  if (!imageRect.width || !imageRect.height) return;

  const marginX = imageRect.width * 0.04;
  const marginY = imageRect.height * 0.04;
  const minX = imageRect.left - marginX;
  const maxX = imageRect.right + marginX;
  const minY = imageRect.top - marginY;
  const maxY = imageRect.bottom + marginY;

  let visibleCount = 0;
  hotspots.forEach((hotspot) => {
    const rect = hotspot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rectIsValid = Number.isFinite(centerX) && Number.isFinite(centerY) && rect.width > 0 && rect.height > 0;
    const isInside = rectIsValid && centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY;
    hotspot.classList.toggle('is-out-of-view', !isInside);
    if (isInside) visibleCount += 1;
  });

  if (visibleCount < 2) {
    hotspots.forEach((hotspot) => hotspot.classList.remove('is-out-of-view'));
  }
}

function normalizeBodyMap() {
  fixInvertedLayers();
  classifyOpenPaths();
  document.querySelectorAll('.body-map-svg').forEach(filterMapZones);
}

const mount = document.querySelector('#body-map-mount');
const observer = new MutationObserver(() => window.requestAnimationFrame(normalizeBodyMap));

if (mount) {
  observer.observe(mount, { childList: true, subtree: true });
}

window.addEventListener('resize', () => window.requestAnimationFrame(normalizeBodyMap));
document.addEventListener('biomech:zones-ready', normalizeBodyMap);

normalizeBodyMap();
setTimeout(normalizeBodyMap, 250);
setTimeout(normalizeBodyMap, 900);
