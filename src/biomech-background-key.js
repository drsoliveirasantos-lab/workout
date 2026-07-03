const WHITE_THRESHOLD = 246;
const COLOR_DELTA = 18;

function isBackgroundWhite(data, index) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const alpha = data[index + 3];
  if (alpha < 8) return false;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  return red >= WHITE_THRESHOLD && green >= WHITE_THRESHOLD && blue >= WHITE_THRESHOLD && max - min <= COLOR_DELTA;
}

function removeConnectedWhiteBackground(imageData, width, height) {
  const { data } = imageData;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const index = pixel * 4;
    if (!isBackgroundWhite(data, index)) return;
    visited[pixel] = 1;
    queue.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pixel = queue[cursor];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    data[pixel * 4 + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  return imageData;
}

function keyImageBackground(svgImage) {
  if (svgImage.dataset.backgroundKeyed === 'true') return;
  const href = svgImage.getAttribute('href') || svgImage.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
  if (!href || !href.startsWith('data:image/')) return;

  svgImage.dataset.backgroundKeyed = 'true';
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    context.putImageData(removeConnectedWhiteBackground(imageData, width, height), 0, 0);
    svgImage.setAttribute('href', canvas.toDataURL('image/png'));
    svgImage.classList.add('has-transparent-background');
  };
  image.src = href;
}

function keyAllBodyImages() {
  document.querySelectorAll('.body-map-image').forEach(keyImageBackground);
}

const mount = document.querySelector('#body-map-mount');
if (mount) {
  new MutationObserver(keyAllBodyImages).observe(mount, { childList: true, subtree: true });
}

keyAllBodyImages();
