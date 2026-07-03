function initZoneFilter() {
  const mount = document.querySelector('#body-map-mount');
  if (!mount) return;

  const apply = () => {
    const maps = mount.querySelectorAll('.body-map-svg');
    maps.forEach(filterMapZones);
  };

  const observer = new MutationObserver(() => window.requestAnimationFrame(apply));
  observer.observe(mount, { childList: true, subtree: true });

  window.addEventListener('resize', () => window.requestAnimationFrame(apply));
  window.requestAnimationFrame(apply);
  setTimeout(apply, 250);
  setTimeout(apply, 900);
}

function filterMapZones(svg) {
  const image = svg.querySelector('.body-map-image');
  const hotspots = [...svg.querySelectorAll('.hotspot')];
  if (!image || !hotspots.length) return;

  const imageRect = image.getBoundingClientRect();
  if (!imageRect.width || !imageRect.height) return;

  const marginX = imageRect.width * 0.08;
  const marginY = imageRect.height * 0.08;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initZoneFilter);
} else {
  initZoneFilter();
}
