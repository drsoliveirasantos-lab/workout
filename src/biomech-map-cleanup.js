function isClosedPath(path) {
  return /z\s*$/i.test((path.getAttribute('d') || '').trim());
}

function classifyOpenPaths() {
  document.querySelectorAll('.hotspot').forEach((path) => {
    path.classList.toggle('is-open-path', !isClosedPath(path));
  });
}

const observer = new MutationObserver(classifyOpenPaths);
const mount = document.querySelector('#body-map-mount');

if (mount) {
  observer.observe(mount, { childList: true, subtree: true });
}

classifyOpenPaths();
