const BODY_CLICK_ZONES = [
  { zone: 'shoulders', label: 'Épaules', x: 23, y: 18, w: 54, h: 13 },
  { zone: 'pecs', label: 'Pectoraux', x: 27, y: 28, w: 46, h: 13 },
  { zone: 'back', label: 'Dos', x: 28, y: 24, w: 44, h: 24 },
  { zone: 'arms', label: 'Bras', x: 8, y: 28, w: 18, h: 34 },
  { zone: 'arms', label: 'Bras', x: 74, y: 28, w: 18, h: 34 },
  { zone: 'core', label: 'Core / abdos', x: 33, y: 40, w: 34, h: 22 },
  { zone: 'glutes', label: 'Fessiers', x: 29, y: 56, w: 42, h: 17 },
  { zone: 'legs', label: 'Jambes', x: 25, y: 68, w: 50, h: 22 },
  { zone: 'calves', label: 'Mollets', x: 27, y: 86, w: 46, h: 12 }
];

function initBodyClickZones() {
  const stage = document.querySelector('#body-stage');
  const map = document.querySelector('#body-map-mount');
  if (!stage || !map) return;

  let layer = document.querySelector('#body-click-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'body-click-layer';
    layer.className = 'body-click-layer';
    stage.insertBefore(layer, document.querySelector('#hud-zone-cards'));
  }

  layer.innerHTML = BODY_CLICK_ZONES.map((item, index) => `
    <button
      class="body-click-zone"
      type="button"
      data-zone="${item.zone}"
      aria-label="Sélectionner ${item.label}"
      style="--x:${item.x}%;--y:${item.y}%;--w:${item.w}%;--h:${item.h}%;"
    ><span>${item.label}</span></button>
  `).join('');

  layer.addEventListener('click', (event) => {
    const zoneButton = event.target.closest('[data-zone]');
    if (!zoneButton) return;
    const zone = zoneButton.dataset.zone;
    document.querySelector(`.hud-zone-card[data-zone="${zone}"]`)?.click();
    syncActiveBodyZone(zone);
  });

  document.addEventListener('click', (event) => {
    const selected = event.target.closest('[data-zone]')?.dataset.zone;
    if (selected) syncActiveBodyZone(selected);
  });

  const observer = new MutationObserver(() => {
    const active = document.querySelector('.hud-zone-card.is-active, .zone-tab.is-active')?.dataset.zone;
    if (active) syncActiveBodyZone(active);
  });
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

  syncActiveBodyZone('global');
}

function syncActiveBodyZone(zone) {
  document.querySelectorAll('.body-click-zone').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.zone === zone);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBodyClickZones);
} else {
  initBodyClickZones();
}
